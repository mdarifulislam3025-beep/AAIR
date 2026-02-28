import { getAllKnowledgeEntries, createKnowledgeEntry } from "./db";
import { IATA_KNOWLEDGE_BASE } from "./iata-data";

export function seedDatabase() {
  const existing = getAllKnowledgeEntries();
  const builtInCount = existing.filter((e) => e.source === "built-in").length;

  if (builtInCount === 0) {
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
