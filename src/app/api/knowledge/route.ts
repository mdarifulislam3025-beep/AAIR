import { NextRequest, NextResponse } from "next/server";
import {
  getAllKnowledgeEntries,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
  searchKnowledge,
} from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

let seeded = false;

function ensureSeeded() {
  if (!seeded) {
    seedDatabase();
    seeded = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    ensureSeeded();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    if (query) {
      const results = searchKnowledge(query, 20);
      return NextResponse.json({ entries: results });
    }

    let entries = getAllKnowledgeEntries() as Array<{ category: string }>;

    if (category && category !== "all") {
      entries = entries.filter((e) => e.category === category);
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Knowledge GET error:", error);
    return NextResponse.json({ error: "Failed to fetch knowledge entries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureSeeded();
    const body = await request.json();
    const { title, content, category, tags } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const entry = createKnowledgeEntry({ title, content, category, tags, source: "admin" });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Knowledge POST error:", error);
    return NextResponse.json({ error: "Failed to create knowledge entry" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureSeeded();
    const body = await request.json();
    const { id, title, content, category, tags } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    updateKnowledgeEntry(id, { title, content, category, tags });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Knowledge PUT error:", error);
    return NextResponse.json({ error: "Failed to update knowledge entry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureSeeded();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    deleteKnowledgeEntry(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Knowledge DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete knowledge entry" }, { status: 500 });
  }
}
