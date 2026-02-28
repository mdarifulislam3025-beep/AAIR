import { NextRequest, NextResponse } from "next/server";
import { createKnowledgeEntry, saveDocument } from "@/lib/db";
import { ensureAdminApiEnabled } from "@/lib/runtime-guards";

export async function POST(request: NextRequest) {
  try {
    const guard = ensureAdminApiEnabled();
    if (guard) return guard;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "text/plain",
      "text/markdown",
      "application/json",
      "text/csv",
    ];
    const allowedExtensions = [".txt", ".md", ".json", ".csv"];

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Only .txt, .md, .json, and .csv files are supported" },
        { status: 400 }
      );
    }

    const content = await file.text();

    if (content.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
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
    return NextResponse.json({ error: "Failed to process uploaded file" }, { status: 500 });
  }
}

interface ParsedEntry {
  title: string;
  content: string;
  category: string;
  tags: string;
}

function parseDocumentContent(filename: string, content: string, ext: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const baseName = filename.replace(/\.[^.]+$/, "");

  if (ext === ".json") {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        for (const item of data) {
          entries.push({
            title: item.title || item.name || `${baseName} Entry`,
            content: item.content || item.description || item.text || JSON.stringify(item),
            category: item.category || "uploaded",
            tags: item.tags || baseName,
          });
        }
      } else if (typeof data === "object") {
        entries.push({
          title: data.title || baseName,
          content: data.content || data.description || JSON.stringify(data, null, 2),
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
  } else if (ext === ".md") {
    // Split markdown by headings
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
  } else if (ext === ".csv") {
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
          title: obj.title || obj.name || obj.question || `${baseName} Row ${i}`,
          content: obj.content || obj.description || obj.answer || obj.text || lines[i],
          category: obj.category || "uploaded",
          tags: obj.tags || baseName,
        });
      }
    }
  } else {
    // Plain text - split by double newlines or treat as single entry
    const paragraphs = content.split(/\n{2,}/).filter((p) => p.trim().length > 20);
    if (paragraphs.length > 1 && paragraphs.length <= 50) {
      for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i].trim();
        const firstLine = para.split("\n")[0].substring(0, 100);
        entries.push({
          title: `${baseName} - Section ${i + 1}: ${firstLine}`,
          content: para,
          category: "uploaded",
          tags: baseName,
        });
      }
    } else {
      entries.push({
        title: baseName,
        content,
        category: "uploaded",
        tags: baseName,
      });
    }
  }

  return entries;
}
