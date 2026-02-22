"use client";

import { useState } from "react";
import KnowledgeManager from "./KnowledgeManager";
import DocumentUploader from "./DocumentUploader";
import SettingsPanel from "./SettingsPanel";

type Tab = "dashboard" | "knowledge" | "upload" | "settings";

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: "dashboard", label: "Dashboard", description: "Overview & AI settings" },
  { id: "knowledge", label: "Knowledge Base", description: "Manage entries" },
  { id: "upload", label: "Upload Documents", description: "Train with files" },
  { id: "settings", label: "Settings", description: "AI configuration" },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-sm">AA</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">AAIR Admin</h1>
              <p className="text-xs text-slate-500">Train & manage the AI agent</p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            Back to Chat
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              <span className="block">{tab.label}</span>
              <span
                className={`block text-[10px] font-normal mt-0.5 ${
                  activeTab === tab.id ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {tab.description}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "dashboard" && <SettingsPanel />}
          {activeTab === "knowledge" && <KnowledgeManager />}
          {activeTab === "upload" && <DocumentUploader />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
