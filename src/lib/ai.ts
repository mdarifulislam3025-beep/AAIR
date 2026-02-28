import { getSetting } from "./db";
import { getBuiltInKnowledge } from "./iata-data";
import { searchKnowledge } from "./db";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface KnowledgeResult {
  title: string;
  content: string;
  category: string;
  source?: string;
}

interface ContextResult {
  context: string;
  hasKnowledge: boolean;
}

function buildContext(query: string): ContextResult {
  // Search admin-added knowledge base
  const dbResults = searchKnowledge(query, 5) as KnowledgeResult[];

  // Search built-in IATA knowledge
  const builtInResults = getBuiltInKnowledge(query);

  const contextParts: string[] = [];

  if (dbResults.length > 0) {
    contextParts.push("=== ADMIN KNOWLEDGE BASE ===");
    for (const r of dbResults) {
      contextParts.push(`[${r.category}] ${r.title}:\n${r.content}\n`);
    }
  }

  if (builtInResults.length > 0) {
    contextParts.push("=== IATA REFERENCE DATA ===");
    for (const r of builtInResults) {
      contextParts.push(`[${r.category}] ${r.title}:\n${r.content}\n`);
    }
  }

  const context = contextParts.join("\n");
  const hasKnowledge = dbResults.length > 0 || builtInResults.length > 0;

  return { context, hasKnowledge };
}

const NOT_FOUND_MESSAGE = `I'm sorry, but I don't have specific information about that topic in my knowledge base.

**Here's what I suggest:**

🔍 **Search Online:**
- [IATA Official Website](https://www.iata.org) — iata.org
- [ICAO](https://www.icao.int) — icao.int
- The airline's official website for carrier-specific policies

📞 **Contact the Relevant Authority:**
- **Your Airline**: Contact the airline's customer service or reservations team directly
- **Airport Authority**: For airport-specific queries, contact the airport's information desk
- **National Aviation Authority**: Such as FAA (USA), EASA (Europe), DGCA (India), CAA (UK), or your country's civil aviation authority
- **IATA**: For industry standards and regulations — [IATA Contact](https://www.iata.org/en/about/contact/)

> ⚠️ *AAIR's knowledge base covers IATA rules, airline regulations, baggage policies, ticketing, dangerous goods, passenger rights, and related topics. If you have a question within these areas, please try rephrasing or ask the admin to add the relevant information to the knowledge base.*`;

const SYSTEM_PROMPT = `You are AAIR (AI Agent for IATA Rules & Airline Regulations), an expert AI assistant specializing in IATA rules, airline regulations, baggage policies, ticketing, dangerous goods (DGR), passenger rights, airport/airline codes, safety standards (IOSA), cargo operations, codeshare agreements, environmental regulations (CORSIA/SAF), and related aviation topics.

**CRITICAL RULES — You MUST follow these strictly:**

1. **Knowledge Base Only**: You MUST answer ONLY based on the knowledge base context provided to you in this conversation. Do NOT use any general knowledge, training data, or information outside of the provided context.

2. **No Context = No Answer**: If the provided knowledge base context does NOT contain relevant information to answer the user's question, you MUST NOT attempt to answer from general knowledge. Instead, respond EXACTLY with this message:

---
I'm sorry, but I don't have specific information about that topic in my knowledge base.

**Here's what I suggest:**

🔍 **Search Online:**
- [IATA Official Website](https://www.iata.org) — iata.org
- [ICAO](https://www.icao.int) — icao.int
- The airline's official website for carrier-specific policies

📞 **Contact the Relevant Authority:**
- **Your Airline**: Contact the airline's customer service or reservations team directly
- **Airport Authority**: For airport-specific queries, contact the airport's information desk
- **National Aviation Authority**: Such as FAA (USA), EASA (Europe), DGCA (India), CAA (UK), or your country's civil aviation authority
- **IATA**: For industry standards and regulations — [IATA Contact](https://www.iata.org/en/about/contact/)

> ⚠️ *AAIR's knowledge base covers IATA rules, airline regulations, baggage policies, ticketing, dangerous goods, passenger rights, and related topics. If you have a question within these areas, please try rephrasing or ask the admin to add the relevant information to the knowledge base.*
---

3. **Cite Sources**: When answering from the knowledge base, cite specific IATA resolutions, regulations, or standards mentioned in the context.

4. **Partial Information**: If the context contains only partial information, answer what you can from the context and clearly state which parts are not covered, then suggest the user contact the relevant authority for the missing details.

5. **Professional Tone**: Be professional, clear, and thorough. Format responses with bullet points and sections when appropriate.`;

export async function generateResponse(
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const { context, hasKnowledge } = buildContext(userMessage);
  const apiKey = getSetting("openai_api_key");
  const model = getSetting("ai_model") || "gpt-3.5-turbo";
  const apiBaseUrl = getSetting("api_base_url") || "https://api.openai.com/v1";

  // If no relevant knowledge found in the database, return the not-found message directly
  // without calling the AI (saves API tokens and ensures consistent behavior)
  if (!hasKnowledge) {
    return NOT_FOUND_MESSAGE;
  }

  // If we have an API key, use the OpenAI-compatible API
  if (apiKey) {
    try {
      return await callOpenAI(apiKey, model, apiBaseUrl, context, userMessage, chatHistory);
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fall back to rule-based response
      return generateRuleBasedResponse(userMessage, context);
    }
  }

  // No API key - use rule-based response
  return generateRuleBasedResponse(userMessage, context);
}

async function callOpenAI(
  apiKey: string,
  model: string,
  baseUrl: string,
  context: string,
  userMessage: string,
  chatHistory: ChatMessage[]
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Always inject the knowledge base context with strict instructions
  messages.push({
    role: "system",
    content: `KNOWLEDGE BASE CONTEXT (use ONLY this information to answer):\n\n${context}\n\n---\nREMINDER: Answer strictly from the above context only. If the context does not contain enough information to answer the question, follow the "No Context = No Answer" rule from your instructions.`,
  });

  // Add recent chat history (last 6 messages)
  const recentHistory = chatHistory.slice(-6);
  for (const msg of recentHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: "user", content: userMessage });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
}

function generateRuleBasedResponse(query: string, context: string): string {
  if (!context || context.trim().length === 0) {
    return NOT_FOUND_MESSAGE;
  }

  // Extract the most relevant section from context
  const sections = context.split("\n\n").filter((s) => s.trim().length > 0);
  let response = `Based on the AAIR knowledge base, here's what I found:\n\n`;

  // Format the context into a readable response
  for (const section of sections.slice(0, 3)) {
    if (section.startsWith("===")) {
      response += `**${section.replace(/=/g, "").trim()}**\n\n`;
    } else if (section.startsWith("[")) {
      const match = section.match(/^\[([^\]]+)\]\s*(.+?):\n([\s\S]+)/);
      if (match) {
        response += `### ${match[2]}\n*Category: ${match[1]}*\n\n${match[3]}\n\n`;
      } else {
        response += section + "\n\n";
      }
    } else {
      response += section + "\n\n";
    }
  }

  response += `---\n*This response is based strictly on the AAIR knowledge base. For more detailed AI-powered responses, an admin can configure an OpenAI API key in the Admin Panel.*`;

  return response;
}
