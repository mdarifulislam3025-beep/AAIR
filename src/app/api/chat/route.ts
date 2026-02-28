import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/ai";
import { saveChatMessage, getChatHistory } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { ensureAgentApiEnabled } from "@/lib/runtime-guards";

let seeded = false;

export async function POST(request: NextRequest) {
  try {
    const guard = ensureAgentApiEnabled();
    if (guard) return guard;
    if (!seeded) {
      seedDatabase();
      seeded = true;
    }

    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sid = sessionId || `session_${Date.now()}`;

    // Save user message
    saveChatMessage(sid, "user", message);

    // Get chat history for context
    const history = getChatHistory(sid, 10) as { role: "user" | "assistant"; content: string }[];

    // Generate AI response
    const response = await generateResponse(message, history);

    // Save assistant response
    saveChatMessage(sid, "assistant", response);

    return NextResponse.json({
      response,
      sessionId: sid,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
