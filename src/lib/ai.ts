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

function buildContext(query: string): string {
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

  return contextParts.join("\n");
}

const SYSTEM_PROMPT = `You are AAIR (AI Agent for IATA Rules & Airline Regulations), an expert AI assistant specializing in:

1. **IATA Rules & Regulations**: Baggage rules, ticketing, fare construction, dangerous goods regulations (DGR), passenger rights, airport/airline codes, safety standards (IOSA), cargo operations, and more.

2. **Airline Industry Knowledge**: Codeshare agreements, interline operations, alliance structures, ground handling (SGHA/ISAGO), environmental regulations (CORSIA/SAF), and passenger services.

3. **Regulatory Frameworks**: EU261, Montreal Convention, US DOT regulations, and other passenger protection laws.

Guidelines:
- Provide accurate, detailed answers based on the knowledge base context provided
- Cite specific IATA resolutions, regulations, or standards when applicable
- If the knowledge base contains relevant information, use it as the primary source
- If you're unsure about specific details, clearly state that and recommend consulting the latest IATA publications
- Be professional, clear, and thorough in your responses
- Format responses with clear structure using bullet points and sections when appropriate
- When discussing rules, mention any important exceptions or variations`;

export async function generateResponse(
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const context = buildContext(userMessage);
  const apiKey = getSetting("openai_api_key");
  const model = getSetting("ai_model") || "gpt-3.5-turbo";
  const apiBaseUrl = getSetting("api_base_url") || "https://api.openai.com/v1";

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

  if (context) {
    messages.push({
      role: "system",
      content: `Use the following knowledge base context to answer the user's question:\n\n${context}`,
    });
  }

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
      temperature: 0.3,
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
    return `I appreciate your question, but I couldn't find specific information in my knowledge base about that topic.

Here are some things I can help you with:
- **Baggage Rules**: Checked baggage allowances, carry-on limits, lost/delayed baggage
- **Ticketing**: E-ticketing, fare rules, refunds and changes
- **Dangerous Goods**: DGR classifications, lithium battery rules
- **Passenger Rights**: Denied boarding, delays, cancellations, EU261
- **Airport/Airline Codes**: IATA 3-letter and 2-letter codes
- **Safety**: IOSA audit standards
- **Cargo**: Air waybills, e-freight, ULD types
- **Travel Documents**: Passport/visa requirements, Timatic
- **Ground Handling**: SGHA, ISAGO standards
- **Environment**: CORSIA, Sustainable Aviation Fuel

Please try rephrasing your question or ask about any of these topics!

> **Note**: For more detailed AI-powered responses, an admin can configure an OpenAI API key in the Admin Panel settings.`;
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

  response += `---\n*This response is generated from the AAIR knowledge base. For more detailed AI-powered responses, an admin can configure an API key in the Admin Panel.*`;

  return response;
}
