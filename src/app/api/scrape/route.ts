import { NextRequest, NextResponse } from "next/server";
import { createKnowledgeEntry, saveDocument } from "@/lib/db";
import https from "https";
import http from "http";

// ── Helpers ────────────────────────────────────────────────────────────────────

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Fetch a URL using Node.js native http/https module (avoids undici/fetch issues on Windows) */
function fetchUrl(url: string, maxRedirects = 5): Promise<{ body: string; contentType: string; statusCode: number }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;

    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "close",
      },
      timeout: 15000,
      // Allow self-signed / corporate proxy certificates
      rejectUnauthorized: false,
    };

    const req = lib.request(options, (res) => {
      // Handle redirects
      if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && res.headers.location && maxRedirects > 0) {
        const redirectUrl = res.headers.location.startsWith("http")
          ? res.headers.location
          : `${parsed.protocol}//${parsed.host}${res.headers.location}`;
        res.resume();
        fetchUrl(redirectUrl, maxRedirects - 1).then(resolve).catch(reject);
        return;
      }

      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          body: Buffer.concat(chunks).toString("utf-8"),
          contentType: res.headers["content-type"] || "",
          statusCode: res.statusCode || 0,
        });
      });
      res.on("error", reject);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out after 15 seconds"));
    });

    req.on("error", reject);
    req.end();
  });
}

/** Extract clean readable text from raw HTML using cheerio */
async function extractTextFromHtml(html: string, url: string): Promise<{ title: string; text: string }> {
  const { load } = await import("cheerio");
  const $ = load(html);

  // Get page title
  const pageTitle =
    $("title").first().text().trim() ||
    $("h1").first().text().trim() ||
    new URL(url).hostname;

  // Remove non-content elements
  $(
    "script, style, nav, footer, header, noscript, iframe, " +
    "aside, .nav, .navbar, .menu, .sidebar, .footer, .header, " +
    ".advertisement, .ads, .cookie, .popup, .modal, [aria-hidden='true']"
  ).remove();

  // Try to get main content area first
  let text = "";
  const mainSelectors = ["main", "article", "[role='main']", ".content", "#content", ".post", ".article"];
  for (const sel of mainSelectors) {
    const el = $(sel);
    if (el.length > 0) {
      text = el.text();
      break;
    }
  }

  // Fallback to body
  if (!text || text.trim().length < 100) {
    text = $("body").text();
  }

  // Clean up whitespace
  text = text
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { title: pageTitle, text };
}

/** Split long text into chunks for knowledge entries */
function chunkText(text: string, chunkSize = 1500): string[] {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 30);

  if (paragraphs.length === 0) {
    // No paragraphs — chunk by character count
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize).trim());
    }
    return chunks.filter((c) => c.length > 20);
  }

  // Group paragraphs into chunks
  const chunks: string[] = [];
  let current = "";
  for (const para of paragraphs) {
    if (current.length + para.length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }
  if (current.trim().length > 20) {
    chunks.push(current.trim());
  }

  return chunks;
}

// ── POST /api/scrape ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, category = "uploaded", tags = "" } = body as {
      url: string;
      category?: string;
      tags?: string;
    };

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL. Must start with http:// or https://" },
        { status: 400 }
      );
    }

    // Fetch the webpage using native Node.js http/https (avoids undici issues on Windows)
    let html: string;
    try {
      const result = await fetchUrl(url);

      if (result.statusCode < 200 || result.statusCode >= 400) {
        return NextResponse.json(
          { error: `Failed to fetch URL: HTTP ${result.statusCode}` },
          { status: 400 }
        );
      }

      const contentType = result.contentType;
      if (
        !contentType.includes("text/html") &&
        !contentType.includes("text/plain") &&
        !contentType.includes("application/xhtml") &&
        contentType !== ""
      ) {
        return NextResponse.json(
          { error: `URL does not return HTML content (got: ${contentType}). Only web pages are supported.` },
          { status: 400 }
        );
      }

      html = result.body;
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      return NextResponse.json(
        { error: `Could not reach the URL: ${msg}` },
        { status: 400 }
      );
    }

    if (!html || html.trim().length === 0) {
      return NextResponse.json(
        { error: "The URL returned empty content." },
        { status: 400 }
      );
    }

    // Extract text
    const { title: pageTitle, text } = await extractTextFromHtml(html, url);

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from the page." },
        { status: 400 }
      );
    }

    // Save raw document record
    const hostname = new URL(url).hostname;
    const docFilename = `web:${hostname}`;
    saveDocument({
      filename: docFilename,
      content: text,
      file_type: ".html",
      size_bytes: Buffer.byteLength(text, "utf-8"),
    });

    // Split into knowledge entry chunks
    const chunks = chunkText(text);
    const autoTags = [hostname, ...(tags ? tags.split(",").map((t) => t.trim()) : [])].filter(Boolean).join(", ");

    let created = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const entryTitle =
        chunks.length === 1
          ? pageTitle
          : `${pageTitle} — Part ${i + 1}`;

      createKnowledgeEntry({
        title: entryTitle,
        content: chunk,
        category,
        tags: autoTags,
        source: `web:${url}`,
      });
      created++;
    }

    return NextResponse.json({
      success: true,
      url,
      pageTitle,
      entriesCreated: created,
      message: `Successfully scraped "${pageTitle}" and created ${created} knowledge entries.`,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    const message = error instanceof Error ? error.message : "Failed to scrape URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
