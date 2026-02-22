"use client";

import { useState, useEffect } from "react";

interface Settings {
  hasApiKey: boolean;
  model: string;
  apiBaseUrl: string;
  stats: {
    totalEntries: number;
    totalDocuments: number;
    totalChats: number;
    categories: string[];
    recentEntries: Array<{
      id: number;
      title: string;
      category: string;
      created_at: string;
    }>;
  };
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [apiBaseUrl, setApiBaseUrl] = useState("https://api.openai.com/v1");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
      setModel(data.model || "gpt-3.5-turbo");
      setApiBaseUrl(data.apiBaseUrl || "https://api.openai.com/v1");
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const body: Record<string, string> = { ai_model: model, api_base_url: apiBaseUrl };
      if (apiKey) body.openai_api_key = apiKey;

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage("Settings saved successfully!");
        setApiKey("");
        fetchSettings();
      } else {
        setMessage("Failed to save settings.");
      }
    } catch {
      setMessage("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      {settings?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{settings.stats.totalEntries}</p>
            <p className="text-xs text-slate-500 mt-1">Knowledge Entries</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{settings.stats.totalDocuments}</p>
            <p className="text-xs text-slate-500 mt-1">Documents</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{settings.stats.totalChats}</p>
            <p className="text-xs text-slate-500 mt-1">Chat Sessions</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{settings.stats.categories.length}</p>
            <p className="text-xs text-slate-500 mt-1">Categories</p>
          </div>
        </div>
      )}

      {/* AI Configuration */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">AI Configuration</h3>
        <p className="text-xs text-slate-500 mb-5">
          Configure the AI model for enhanced responses. Without an API key, the agent uses rule-based responses from the knowledge base.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              OpenAI API Key
              {settings?.hasApiKey && (
                <span className="ml-2 text-xs text-green-600 font-normal">Configured</span>
              )}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={settings?.hasApiKey ? "••••••••••••••••••••" : "sk-..."}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Leave blank to keep the current key. Supports OpenAI and compatible APIs.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Base URL</label>
            <input
              type="url"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Change this to use alternative OpenAI-compatible APIs (e.g., Azure OpenAI, local LLMs, Groq, Together AI).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">AI Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast, Cost-effective)</option>
              <option value="gpt-4">GPT-4 (Most Capable)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo (Fast + Capable)</option>
              <option value="gpt-4o">GPT-4o (Latest)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (Efficient)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              For custom models (e.g., local LLMs), type the model name directly.
            </p>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Or type a custom model name..."
              className="w-full mt-2 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-sm ${
                message.includes("success")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>

      {/* How it works */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">How the AI Agent Works</h3>
        <div className="space-y-4 text-sm text-slate-600">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-slate-700">Knowledge Base Search</p>
              <p className="text-xs text-slate-500">
                When a user asks a question, the system searches both the built-in IATA knowledge base and any admin-added entries for relevant information.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-slate-700">Context Building</p>
              <p className="text-xs text-slate-500">
                Relevant knowledge entries are compiled into a context that the AI uses to generate accurate, sourced responses.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-slate-700">AI Response Generation</p>
              <p className="text-xs text-slate-500">
                With an API key: Uses the configured AI model (GPT-4, etc.) for intelligent, contextual responses.
                Without an API key: Returns formatted knowledge base content directly.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              4
            </div>
            <div>
              <p className="font-medium text-slate-700">Continuous Learning</p>
              <p className="text-xs text-slate-500">
                Admins can add new knowledge entries, upload documents, and update existing content. The AI immediately uses new information in its responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      {settings?.stats?.recentEntries && settings.stats.recentEntries.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Recently Added Entries</h3>
          <div className="space-y-2">
            {settings.stats.recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm text-slate-700 font-medium">{entry.title}</p>
                  <p className="text-[10px] text-slate-400">{entry.category}</p>
                </div>
                <p className="text-[10px] text-slate-400">
                  {new Date(entry.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
