import { createKnowledgeEntry, getAllKnowledgeEntries } from "./db";
import { IATA_KNOWLEDGE_BASE } from "./iata-data";

export function seedDatabase() {
  const existingEntries = getAllKnowledgeEntries() as Array<{ source?: string }>;
  const count = existingEntries.filter((entry) => entry.source === "built-in").length;

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
