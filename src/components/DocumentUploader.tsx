"use client";

import { useState, useRef } from "react";

interface UploadResult {
  success: boolean;
  filename: string;
  entriesCreated: number;
  message: string;
  type: "file" | "url";
}

const ACCEPTED_EXTENSIONS =
  ".txt,.md,.json,.csv,.pdf,.docx,.doc,.html,.htm,.xml,.rtf,.log,.yaml,.yml";

const FILE_TYPE_LABELS: Record<string, string> = {
  ".pdf":  "PDF",
  ".docx": "Word",
  ".doc":  "Word (Legacy)",
  ".txt":  "Text",
  ".md":   "Markdown",
  ".json": "JSON",
  ".csv":  "CSV",
  ".html": "HTML",
  ".htm":  "HTML",
  ".xml":  "XML",
  ".rtf":  "RTF",
  ".log":  "Log",
  ".yaml": "YAML",
  ".yml":  "YAML",
};

const CATEGORIES = [
  "general", "baggage", "ticketing", "dangerous-goods",
  "passenger-rights", "codes", "safety", "cargo",
  "travel-documents", "ground-handling", "airline-operations",
  "environment", "passenger-services", "uploaded", "custom",
];

export default function DocumentUploader() {
  // ── File upload state ──────────────────────────────────────────────────────
  const [uploading, setUploading]   = useState(false);
  const [dragOver, setDragOver]     = useState(false);
  const [results, setResults]       = useState<UploadResult[]>([]);
  const [fileError, setFileError]   = useState("");
  const fileInputRef                = useRef<HTMLInputElement>(null);

  // ── URL scrape state ───────────────────────────────────────────────────────
  const [scrapeUrl, setScrapeUrl]         = useState("");
  const [scrapeCategory, setScrapeCategory] = useState("uploaded");
  const [scrapeTags, setScrapeTags]       = useState("");
  const [scraping, setScraping]           = useState(false);
  const [scrapeError, setScrapeError]     = useState("");

  // ── File upload handler ────────────────────────────────────────────────────
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setFileError("");
    const newResults: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res  = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        newResults.push({
          success:        res.ok,
          filename:       file.name,
          entriesCreated: data.entriesCreated ?? 0,
          message:        data.message || data.error || "Upload failed",
          type:           "file",
        });
      } catch {
        newResults.push({
          success:        false,
          filename:       file.name,
          entriesCreated: 0,
          message:        "Network error during upload",
          type:           "file",
        });
      }
    }

    setResults((prev) => [...newResults, ...prev]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── URL scrape handler ─────────────────────────────────────────────────────
  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim()) return;

    setScraping(true);
    setScrapeError("");

    try {
      const res  = await fetch("/api/scrape", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          url:      scrapeUrl.trim(),
          category: scrapeCategory,
          tags:     scrapeTags,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setResults((prev) => [
          {
            success:        true,
            filename:       scrapeUrl.trim(),
            entriesCreated: data.entriesCreated,
            message:        data.message,
            type:           "url",
          },
          ...prev,
        ]);
        setScrapeUrl("");
        setScrapeTags("");
      } else {
        setScrapeError(data.error || "Failed to scrape URL");
      }
    } catch {
      setScrapeError("Network error while scraping URL");
    } finally {
      setScraping(false);
    }
  };

  // ── Drag & drop ────────────────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">

      {/* ── Section 1: File Upload ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
          Upload Documents
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Upload any document — PDF, Word, text, spreadsheet, or markup file.
        </p>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_EXTENSIONS}
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          {uploading ? (
            <div>
              <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-blue-600 font-medium">Processing files…</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-700 mb-1">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-slate-400">Max 10 MB per file</p>
            </>
          )}
        </div>

        {/* Supported formats badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(FILE_TYPE_LABELS)
            .filter(([ext], i, arr) => arr.findIndex(([, v]) => v === FILE_TYPE_LABELS[ext]) === i)
            .map(([ext, label]) => (
              <span key={ext} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                {label}
              </span>
            ))}
        </div>

        {fileError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {fileError}
          </div>
        )}
      </div>

      {/* ── Section 2: URL / Website Scraper ──────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
          Train from a Website / URL
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Paste any public webpage URL — the AI will fetch, read, and save its content to memory.
        </p>

        <form onSubmit={handleScrape} className="space-y-3">
          {/* URL input */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Website URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                placeholder="https://www.iata.org/en/programs/..."
                required
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={scraping || !scrapeUrl.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
              >
                {scraping ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Fetching…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Scrape & Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <select
                value={scrapeCategory}
                onChange={(e) => setScrapeCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tags <span className="text-slate-400 font-normal">(comma-separated, optional)</span>
              </label>
              <input
                type="text"
                value={scrapeTags}
                onChange={(e) => setScrapeTags(e.target.value)}
                placeholder="e.g., iata, baggage, 2025"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </form>

        {scrapeError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {scrapeError}
          </div>
        )}

        {/* Tips */}
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-xs font-medium text-indigo-700 mb-1">💡 Tips for best results</p>
          <ul className="text-xs text-indigo-600 space-y-0.5 list-disc list-inside">
            <li>Use direct article or documentation URLs (not homepages)</li>
            <li>IATA.org, airline policy pages, and regulatory sites work great</li>
            <li>The AI will split long pages into multiple knowledge entries automatically</li>
            <li>Private/login-protected pages cannot be accessed</li>
          </ul>
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">How Training Works</h3>
        <div className="space-y-3">
          {[
            {
              step: "1",
              title: "Upload or provide a URL",
              desc: "Upload any document (PDF, Word, CSV, etc.) or paste a public webpage URL.",
            },
            {
              step: "2",
              title: "Automatic text extraction",
              desc: "The system extracts readable text from the file or webpage and splits it into knowledge entries.",
            },
            {
              step: "3",
              title: "Saved to persistent memory",
              desc: "All entries are saved to the local database (data/aair.json) and survive server restarts.",
            },
            {
              step: "4",
              title: "AI uses it immediately",
              desc: "The AI agent searches the knowledge base on every question and uses the new content in its answers.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {step}
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── JSON Template ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">JSON Template for Bulk Upload</h3>
        <pre className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 overflow-x-auto font-mono">
{`[
  {
    "title": "Entry Title",
    "content": "Detailed content...",
    "category": "baggage",
    "tags": "tag1, tag2"
  },
  {
    "title": "Another Entry",
    "content": "More content...",
    "category": "ticketing",
    "tags": "fare, rules"
  }
]`}
        </pre>
      </div>

      {/* ── Upload / Scrape History ────────────────────────────────────────── */}
      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Training History</h3>
            <button
              onClick={() => setResults([])}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {results.map((result, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-sm ${
                  result.success
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Icon */}
                    {result.type === "url" ? (
                      <span className="flex-shrink-0 text-base">🌐</span>
                    ) : (
                      <span className="flex-shrink-0 text-base">📄</span>
                    )}
                    <span className="font-medium truncate">{result.filename}</span>
                  </div>
                  {result.success && (
                    <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                      result.success ? "bg-green-100 text-green-600" : ""
                    }`}>
                      {result.entriesCreated} entries saved
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 opacity-80 pl-6">{result.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
