import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "aair.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      tags TEXT DEFAULT '',
      source TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS uploaded_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      content TEXT NOT NULL,
      file_type TEXT NOT NULL,
      size_bytes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_entries(category);
    CREATE INDEX IF NOT EXISTS idx_knowledge_tags ON knowledge_entries(tags);
    CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
  `);
}

// Knowledge entries CRUD
export function getAllKnowledgeEntries() {
  const db = getDb();
  return db.prepare("SELECT * FROM knowledge_entries ORDER BY updated_at DESC").all();
}

export function getKnowledgeEntryById(id: number) {
  const db = getDb();
  return db.prepare("SELECT * FROM knowledge_entries WHERE id = ?").get(id);
}

export function createKnowledgeEntry(entry: {
  title: string;
  content: string;
  category: string;
  tags?: string;
  source?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO knowledge_entries (title, content, category, tags, source) VALUES (?, ?, ?, ?, ?)"
  );
  const result = stmt.run(
    entry.title,
    entry.content,
    entry.category,
    entry.tags || "",
    entry.source || "admin"
  );
  return { id: result.lastInsertRowid, ...entry };
}

export function updateKnowledgeEntry(
  id: number,
  entry: { title?: string; content?: string; category?: string; tags?: string }
) {
  const db = getDb();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (entry.title !== undefined) { fields.push("title = ?"); values.push(entry.title); }
  if (entry.content !== undefined) { fields.push("content = ?"); values.push(entry.content); }
  if (entry.category !== undefined) { fields.push("category = ?"); values.push(entry.category); }
  if (entry.tags !== undefined) { fields.push("tags = ?"); values.push(entry.tags); }

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  const stmt = db.prepare(`UPDATE knowledge_entries SET ${fields.join(", ")} WHERE id = ?`);
  return stmt.run(...values);
}

export function deleteKnowledgeEntry(id: number) {
  const db = getDb();
  return db.prepare("DELETE FROM knowledge_entries WHERE id = ?").run(id);
}

export function searchKnowledge(query: string, limit = 10) {
  const db = getDb();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const conditions = terms.map(() => "(LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(tags) LIKE ?)");
  const params = terms.flatMap((t) => {
    const like = `%${t}%`;
    return [like, like, like];
  });

  const sql = `SELECT *, (
    ${terms.map((_, i) => `(CASE WHEN LOWER(title) LIKE ? THEN 3 ELSE 0 END + CASE WHEN LOWER(tags) LIKE ? THEN 2 ELSE 0 END + CASE WHEN LOWER(content) LIKE ? THEN 1 ELSE 0 END)`).join(" + ")}
  ) as relevance
  FROM knowledge_entries
  WHERE ${conditions.join(" OR ")}
  ORDER BY relevance DESC
  LIMIT ?`;

  const scoreParams = terms.flatMap((t) => {
    const like = `%${t}%`;
    return [like, like, like];
  });

  return db.prepare(sql).all(...scoreParams, ...params, limit);
}

// Settings
export function getSetting(key: string): string | null {
  const db = getDb();
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string) {
  const db = getDb();
  db.prepare(
    "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP"
  ).run(key, value, value);
}

// Chat history
export function saveChatMessage(sessionId: string, role: "user" | "assistant", content: string) {
  const db = getDb();
  db.prepare("INSERT INTO chat_history (session_id, role, content) VALUES (?, ?, ?)").run(
    sessionId,
    role,
    content
  );
}

export function getChatHistory(sessionId: string, limit = 20) {
  const db = getDb();
  return db
    .prepare("SELECT * FROM chat_history WHERE session_id = ? ORDER BY created_at DESC LIMIT ?")
    .all(sessionId, limit)
    .reverse();
}

// Documents
export function saveDocument(doc: { filename: string; content: string; file_type: string; size_bytes: number }) {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO uploaded_documents (filename, content, file_type, size_bytes) VALUES (?, ?, ?, ?)"
  );
  return stmt.run(doc.filename, doc.content, doc.file_type, doc.size_bytes);
}

export function getAllDocuments() {
  const db = getDb();
  return db.prepare("SELECT id, filename, file_type, size_bytes, created_at FROM uploaded_documents ORDER BY created_at DESC").all();
}

// Stats
export function getStats() {
  const db = getDb();
  const totalEntries = (db.prepare("SELECT COUNT(*) as count FROM knowledge_entries").get() as { count: number }).count;
  const totalDocuments = (db.prepare("SELECT COUNT(*) as count FROM uploaded_documents").get() as { count: number }).count;
  const totalChats = (db.prepare("SELECT COUNT(DISTINCT session_id) as count FROM chat_history").get() as { count: number }).count;
  const categories = db.prepare("SELECT DISTINCT category FROM knowledge_entries ORDER BY category").all() as { category: string }[];
  const recentEntries = db.prepare("SELECT id, title, category, created_at FROM knowledge_entries ORDER BY created_at DESC LIMIT 5").all();

  return {
    totalEntries,
    totalDocuments,
    totalChats,
    categories: categories.map((c) => c.category),
    recentEntries,
  };
}
