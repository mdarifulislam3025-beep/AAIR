import { NextRequest, NextResponse } from "next/server";
import { createKnowledgeEntry, saveDocument } from "@/lib/db";
import { ensureAdminApiEnabled } from "@/lib/runtime-guards";

// ── Supported file types ───────────────────────────────────────────────────────
const ALLOWED_EXTENSIONS = [
  ".txt", ".md", ".json", ".csv",
  ".pdf", ".docx", ".doc",
  ".html", ".htm", ".xml",
  ".rtf", ".log", ".yaml", ".yml",
];

// ── Extract text from PDF ──────────────────────────────────────────────────────
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err) {
    console.error("PDF parse error:", err);
    throw new Error("Failed to parse PDF file. The file may be corrupted or password-protected.");
  }
}

// ── Extract text from DOCX / DOC ──────────────────────────────────────────────
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (err) {
    console.error("DOCX parse error:", err);
    throw new Error("Failed to parse Word document. The file may be corrupted.");
  }
}

// ── Extract text from HTML ─────────────────────────────────────────────────────
async function extractHtmlText(html: string): Promise<string> {
  try {
    const { load } = await import("cheerio");
    const $ = load(html);
    // Remove scripts, styles, nav, footer
    $("script, style, nav, footer, header, noscript, iframe").remove();
    return $("body").text().replace(/\s+/g, " ").trim();
  } catch {
    // Fallback: strip tags with regex
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}

// ── Main POST handler ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const guard = ensureAdminApiEnabled();
    if (guard) return guard;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = ("." + (file.name.split(".").pop() || "")).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file type "${ext}". Supported formats: ${ALLOWED_EXTENSIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Size check (10 MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10 MB limit" },
        { status: 400 }
      );
    }

    let content = "";

    // ── Binary formats ─────────────────────────────────────────────────────────
    if (ext === ".pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      content = await extractPdfText(buffer);
    } else if (ext === ".docx" || ext === ".doc") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      content = await extractDocxText(buffer);
    } else if (ext === ".html" || ext === ".htm") {
      const raw = await file.text();
      content = await extractHtmlText(raw);
    } else {
      // Plain text-based formats: .txt, .md, .json, .csv, .xml, .rtf, .log, .yaml, .yml
      content = await file.text();
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "No readable text content found in the file." },
        { status: 400 }
      );
    }

    // Save the document record
    saveDocument({
      filename: file.name,
      content,
      file_type: ext,
      size_bytes: file.size,
    });

    // Parse content into knowledge entries
    const entries = parseDocumentContent(file.name, content, ext);

    let created = 0;
    for (const entry of entries) {
      createKnowledgeEntry({
        title: entry.title,
        content: entry.content,
        category: entry.category,
        tags: entry.tags,
        source: `upload:${file.name}`,
      });
      created++;
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      entriesCreated: created,
      message: `Successfully processed "${file.name}" and created ${created} knowledge entries.`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Failed to process uploaded file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── Content parser ─────────────────────────────────────────────────────────────

interface ParsedEntry {
  title: string;
  content: string;
  category: string;
  tags: string;
}

function parseDocumentContent(
  filename: string,
  content: string,
  ext: string
): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const baseName = filename.replace(/\.[^.]+$/, "");

  // ── JSON ──────────────────────────────────────────────────────────────────────
  if (ext === ".json") {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        for (const item of data) {
          entries.push({
            title: item.title || item.name || `${baseName} Entry`,
            content:
              item.content ||
              item.description ||
              item.text ||
              JSON.stringify(item),
            category: item.category || "uploaded",
            tags: item.tags || baseName,
          });
        }
      } else if (typeof data === "object") {
        entries.push({
          title: data.title || baseName,
          content:
            data.content ||
            data.description ||
            JSON.stringify(data, null, 2),
          category: data.category || "uploaded",
          tags: data.tags || baseName,
        });
      }
    } catch {
      entries.push({
        title: baseName,
        content,
        category: "uploaded",
        tags: baseName,
      });
    }
    return entries;
  }

  // ── CSV ───────────────────────────────────────────────────────────────────────
  if (ext === ".csv") {
    const lines = content.split("\n").filter((l) => l.trim());
    if (lines.length > 1) {
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          obj[h] = values[idx] || "";
        });
        entries.push({
          title:
            obj.title ||
            obj.name ||
            obj.question ||
            `${baseName} Row ${i}`,
          content:
            obj.content ||
            obj.description ||
            obj.answer ||
            obj.text ||
            lines[i],
          category: obj.category || "uploaded",
          tags: obj.tags || baseName,
        });
      }
    }
    return entries;
  }

  // ── Markdown ──────────────────────────────────────────────────────────────────
  if (ext === ".md") {
    const sections = content.split(/^#{1,3}\s+/m).filter((s) => s.trim());
    if (sections.length > 1) {
      for (const section of sections) {
        const lines = section.trim().split("\n");
        const title = lines[0]?.trim() || baseName;
        const body = lines.slice(1).join("\n").trim();
        if (body.length > 10) {
          entries.push({
            title,
            content: body,
            category: "uploaded",
            tags: baseName,
          });
        }
      }
    } else {
      entries.push({
        title: baseName,
        content,
        category: "uploaded",
        tags: baseName,
      });
    }
    return entries;
  }

  // ── YAML / YML ────────────────────────────────────────────────────────────────
  if (ext === ".yaml" || ext === ".yml") {
    entries.push({
      title: baseName,
      content,
      category: "uploaded",
      tags: `${baseName},yaml`,
    });
    return entries;
  }

  // ── XML ───────────────────────────────────────────────────────────────────────
  if (ext === ".xml") {
    // Strip XML tags and use plain text
    const plainText = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    entries.push({
      title: baseName,
      content: plainText,
      category: "uploaded",
      tags: `${baseName},xml`,
    });
    return entries;
  }

  // ── PDF / DOCX / DOC / HTML / TXT / RTF / LOG (all plain-text after extraction) ──
  // Split by double newlines or headings for large documents
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30);

  if (paragraphs.length > 1 && paragraphs.length <= 100) {
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      const firstLine = para.split("\n")[0].substring(0, 120);
      entries.push({
        title: `${baseName} — Part ${i + 1}: ${firstLine}`,
        content: para,
        category: "uploaded",
        tags: baseName,
      });
    }
  } else if (paragraphs.length > 100) {
    // Very large document — chunk into ~1000-char blocks
    const chunkSize = 1000;
    const fullText = content.trim();
    let idx = 0;
    let part = 1;
    while (idx < fullText.length) {
      const chunk = fullText.substring(idx, idx + chunkSize);
      entries.push({
        title: `${baseName} — Chunk ${part}`,
        content: chunk,
        category: "uploaded",
        tags: baseName,
      });
      idx += chunkSize;
      part++;
    }
  } else {
    entries.push({
      title: baseName,
      content,
      category: "uploaded",
      tags: baseName,
    });
  }

  return entries;
}
