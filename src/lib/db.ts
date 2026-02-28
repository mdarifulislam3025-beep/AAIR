import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "aair.json");

// ── Types ──────────────────────────────────────────────────────────────────────

interface KnowledgeEntry {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string;
  source: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: number;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface UploadedDocument {
  id: number;
  filename: string;
  content: string;
  file_type: string;
  size_bytes: number;
  created_at: string;
}

interface DbStore {
  knowledge_entries: KnowledgeEntry[];
  chat_history: ChatMessage[];
  settings: Record<string, string>;
  uploaded_documents: UploadedDocument[];
  _sequences: { knowledge: number; chat: number; documents: number };
}

// ── Persistence helpers ────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

function loadDb(): DbStore {
  if (fs.existsSync(DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as DbStore;
    } catch {
      // corrupted – start fresh
    }
  }
  return {
    knowledge_entries: [],
    chat_history: [],
    settings: {},
    uploaded_documents: [],
    _sequences: { knowledge: 0, chat: 0, documents: 0 },
  };
}

function saveDb(store: DbStore): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(store, null, 2), "utf-8");
}

// ── Knowledge entries CRUD ─────────────────────────────────────────────────────

export function getAllKnowledgeEntries(): KnowledgeEntry[] {
  const store = loadDb();
  return [...store.knowledge_entries].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function getKnowledgeEntryById(id: number): KnowledgeEntry | undefined {
  const store = loadDb();
  return store.knowledge_entries.find((e) => e.id === id);
}

export function createKnowledgeEntry(entry: {
  title: string;
  content: string;
  category: string;
  tags?: string;
  source?: string;
}): KnowledgeEntry {
  const store = loadDb();
  store._sequences.knowledge += 1;
  const newEntry: KnowledgeEntry = {
    id: store._sequences.knowledge,
    title: entry.title,
    content: entry.content,
    category: entry.category,
    tags: entry.tags || "",
    source: entry.source || "admin",
    created_at: now(),
    updated_at: now(),
  };
  store.knowledge_entries.push(newEntry);
  saveDb(store);
  return newEntry;
}

export function updateKnowledgeEntry(
  id: number,
  entry: { title?: string; content?: string; category?: string; tags?: string }
): boolean {
  const store = loadDb();
  const idx = store.knowledge_entries.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  const existing = store.knowledge_entries[idx];
  store.knowledge_entries[idx] = {
    ...existing,
    ...(entry.title !== undefined && { title: entry.title }),
    ...(entry.content !== undefined && { content: entry.content }),
    ...(entry.category !== undefined && { category: entry.category }),
    ...(entry.tags !== undefined && { tags: entry.tags }),
    updated_at: now(),
  };
  saveDb(store);
  return true;
}

export function deleteKnowledgeEntry(id: number): boolean {
  const store = loadDb();
  const before = store.knowledge_entries.length;
  store.knowledge_entries = store.knowledge_entries.filter((e) => e.id !== id);
  saveDb(store);
  return store.knowledge_entries.length < before;
}

// Stop words to exclude from relevance scoring
const STOP_WORDS = new Set([
  "a","an","the","is","it","in","on","at","to","for","of","and","or","but",
  "how","do","i","me","my","we","you","your","what","when","where","who",
  "which","this","that","these","those","can","could","would","should","will",
  "be","been","being","have","has","had","was","were","are","am","with",
  "from","by","about","into","through","during","near","above","below",
  "between","out","off","over","under","again","then","once","here","there",
  "why","so","if","as","up","down","any","all","both","each","few","more",
  "most","other","some","such","no","not","only","same","than","too","very",
  "just","because","while","although","though","since","until","unless",
  "please","tell","give","show","explain","describe","find","get","make",
  "want","need","like","know","think","see","look","use","go","come","take",
]);

/** Escape special regex characters in a search term */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Returns true if `text` contains `term` as a whole word */
function wordMatch(text: string, term: string): boolean {
  return new RegExp(`(?<![a-z])${escapeRegex(term)}(?![a-z])`, "i").test(text);
}

export function searchKnowledge(query: string, limit = 10): KnowledgeEntry[] {
  const store = loadDb();
  // Filter out stop words for more precise matching
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

  if (terms.length === 0) return [];

  const scored = store.knowledge_entries
    .map((e) => {
      let score = 0;
      for (const t of terms) {
        if (wordMatch(e.title, t)) score += 3;
        if (wordMatch(e.tags, t)) score += 2;
        if (wordMatch(e.content, t)) score += 1;
      }
      return { entry: e, score };
    })
    // Minimum score of 3 required: at least one whole-word title match,
    // or one tag match + one content match — prevents false positives
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.entry);

  return scored;
}

// ── Settings ───────────────────────────────────────────────────────────────────

export function getSetting(key: string): string | null {
  const store = loadDb();
  return store.settings[key] ?? null;
}

export function setSetting(key: string, value: string): void {
  const store = loadDb();
  store.settings[key] = value;
  saveDb(store);
}

// ── Chat history ───────────────────────────────────────────────────────────────

export function saveChatMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): void {
  const store = loadDb();
  store._sequences.chat += 1;
  store.chat_history.push({
    id: store._sequences.chat,
    session_id: sessionId,
    role,
    content,
    created_at: now(),
  });
  saveDb(store);
}

export function getChatHistory(sessionId: string, limit = 20): ChatMessage[] {
  const store = loadDb();
  const msgs = store.chat_history
    .filter((m) => m.session_id === sessionId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
    .reverse();
  return msgs;
}

// ── Documents ──────────────────────────────────────────────────────────────────

export function saveDocument(doc: {
  filename: string;
  content: string;
  file_type: string;
  size_bytes: number;
}): UploadedDocument {
  const store = loadDb();
  store._sequences.documents += 1;
  const newDoc: UploadedDocument = {
    id: store._sequences.documents,
    filename: doc.filename,
    content: doc.content,
    file_type: doc.file_type,
    size_bytes: doc.size_bytes,
    created_at: now(),
  };
  store.uploaded_documents.push(newDoc);
  saveDb(store);
  return newDoc;
}

export function getAllDocuments(): Omit<UploadedDocument, "content">[] {
  const store = loadDb();
  return [...store.uploaded_documents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(({ content: _content, ...rest }) => rest);
}

// ── Stats ──────────────────────────────────────────────────────────────────────

export function getStats() {
  const store = loadDb();
  const totalEntries = store.knowledge_entries.length;
  const totalDocuments = store.uploaded_documents.length;
  const sessionIds = new Set(store.chat_history.map((m) => m.session_id));
  const totalChats = sessionIds.size;
  const categories = Array.from(new Set(store.knowledge_entries.map((e) => e.category))).sort();
  const recentEntries = [...store.knowledge_entries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(({ id, title, category, created_at }) => ({ id, title, category, created_at }));

  return { totalEntries, totalDocuments, totalChats, categories, recentEntries };
}
