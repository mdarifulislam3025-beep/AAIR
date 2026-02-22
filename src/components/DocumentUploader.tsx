"use client";

import { useState, useRef } from "react";

interface UploadResult {
  success: boolean;
  filename: string;
  entriesCreated: number;
  message: string;
}

export default function DocumentUploader() {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    const newResults: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          newResults.push({
            success: true,
            filename: file.name,
            entriesCreated: data.entriesCreated,
            message: data.message,
          });
        } else {
          newResults.push({
            success: false,
            filename: file.name,
            entriesCreated: 0,
            message: data.error || "Upload failed",
          });
        }
      } catch {
        newResults.push({
          success: false,
          filename: file.name,
          entriesCreated: 0,
          message: "Network error during upload",
        });
      }
    }

    setResults((prev) => [...newResults, ...prev]);
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.md,.json,.csv"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        {uploading ? (
          <div>
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-blue-600 font-medium">Processing files...</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-slate-400">
              Supported formats: .txt, .md, .json, .csv (max 5MB each)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* How it works */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">How Document Upload Works</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="text-sm text-slate-700 font-medium">Upload your document</p>
              <p className="text-xs text-slate-500">
                Upload .txt, .md, .json, or .csv files containing IATA rules, airline policies, or any aviation knowledge.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-sm text-slate-700 font-medium">Automatic parsing</p>
              <p className="text-xs text-slate-500">
                The system automatically parses the document into knowledge entries based on structure (headings, sections, rows).
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-sm text-slate-700 font-medium">AI learns from content</p>
              <p className="text-xs text-slate-500">
                The AI agent immediately uses the new knowledge entries to answer user questions with more accurate, up-to-date information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Template */}
      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-5">
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

      {/* Upload Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Upload History</h3>
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
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.filename}</span>
                  {result.success && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      {result.entriesCreated} entries created
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 opacity-80">{result.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
