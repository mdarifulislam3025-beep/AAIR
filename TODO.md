# AAIR Task TODO

## Task: Knowledge-based chat responses with fallback suggestions

### Steps

- [x] Read and understand src/lib/ai.ts
- [x] Read and understand src/lib/db.ts
- [x] Read and understand src/lib/iata-data.ts
- [x] Read and understand src/app/api/chat/route.ts
- [x] Plan confirmed by user
- [x] Update src/lib/ai.ts:
  - [x] Update SYSTEM_PROMPT to enforce knowledge-base-only answers
  - [x] Add NOT_FOUND_MESSAGE constant with internet/authority suggestions
  - [x] Add ContextResult interface with hasKnowledge flag
  - [x] Update buildContext() to return { context, hasKnowledge }
  - [x] Update generateResponse() to skip OpenAI when no knowledge found
  - [x] Update callOpenAI() with stricter context-only instruction
  - [x] Update generateRuleBasedResponse() to use NOT_FOUND_MESSAGE
- [x] Update src/lib/db.ts:
  - [x] Add STOP_WORDS set to filter common words
  - [x] Add wordMatch() helper for whole-word boundary matching
  - [x] Update searchKnowledge() with stop-word filtering, word-boundary matching, min score >= 3
- [x] Update src/lib/iata-data.ts:
  - [x] Add STOP_WORDS set (mirrors db.ts)
  - [x] Add wordMatch() helper for whole-word boundary matching
  - [x] Update getBuiltInKnowledge() with stop-word filtering, word-boundary matching, min score >= 3
- [x] Test: unknown topic ("hotel booking") → returns NOT_FOUND_MESSAGE ✓
- [x] Test: known topic ("baggage rules") → returns knowledge-based response ✓
