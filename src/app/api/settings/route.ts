import { NextRequest, NextResponse } from "next/server";
import { getSetting, setSetting, getStats } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { ensureAdminApiEnabled } from "@/lib/runtime-guards";

let seeded = false;

function ensureSeeded() {
  if (!seeded) {
    seedDatabase();
    seeded = true;
  }
}

export async function GET() {
  try {
    const guard = ensureAdminApiEnabled();
    if (guard) return guard;

    ensureSeeded();
    const stats = getStats();
    const hasApiKey = !!getSetting("openai_api_key");
    const model = getSetting("ai_model") || "gpt-3.5-turbo";
    const apiBaseUrl = getSetting("api_base_url") || "https://api.openai.com/v1";

    return NextResponse.json({
      hasApiKey,
      model,
      apiBaseUrl,
      stats,
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = ensureAdminApiEnabled();
    if (guard) return guard;

    ensureSeeded();
    const body = await request.json();
    const { openai_api_key, ai_model, api_base_url } = body;

    if (openai_api_key !== undefined) {
      setSetting("openai_api_key", openai_api_key);
    }
    if (ai_model) {
      setSetting("ai_model", ai_model);
    }
    if (api_base_url) {
      setSetting("api_base_url", api_base_url);
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
