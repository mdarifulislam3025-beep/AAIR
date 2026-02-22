import { getDb, createKnowledgeEntry } from "./db";
import { IATA_KNOWLEDGE_BASE } from "./iata-data";

export function seedDatabase() {
  const db = getDb();
  const count = (
    db.prepare("SELECT COUNT(*) as count FROM knowledge_entries WHERE source = 'built-in'").get() as { count: number }
  ).count;

  if (count === 0) {
    for (const entry of IATA_KNOWLEDGE_BASE) {
      createKnowledgeEntry({
        title: entry.title,
        content: entry.content,
        category: entry.category,
        tags: entry.tags,
        source: "built-in",
      });
    }
    console.log(`Seeded ${IATA_KNOWLEDGE_BASE.length} built-in IATA knowledge entries.`);
  }
}
