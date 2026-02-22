"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What are the IATA baggage rules for checked luggage?",
  "Explain EU261 passenger rights for flight delays",
  "What are the lithium battery rules for air travel?",
  "How does the IATA e-ticketing system work?",
  "What are the 9 classes of dangerous goods?",
  "Explain codeshare and interline agreements",
];

function formatMarkdown(text: string): string {
  let html = text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-slate-800 mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-slate-800 mt-4 mb-2">$2</h2>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-slate-200 my-3">')
    // Unordered list items
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-700">$1</li>')
    // Ordered list items
    .replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal text-slate-700">$1</li>')
    // Blockquote
    .replace(/^>\s*(.+)$/gm, '<blockquote class="border-l-3 border-blue-400 pl-3 py-1 my-2 text-slate-600 bg-blue-50 rounded-r">$1</blockquote>')
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  return html;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, sessionId }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_resp`,
        role: "assistant",
        content: data.response || "Sorry, I couldn't process your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: `msg_${Date.now()}_err`,
        role: "assistant",
        content: "I apologize, but there was an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-sm">AA</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">AAIR</h1>
              <p className="text-xs text-slate-500">AI Agent for IATA Rules & Airline Regulations</p>
            </div>
          </div>
          <a
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            Admin Panel
          </a>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              {/* Welcome */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-200 mb-6">
                <span className="text-white font-bold text-2xl">AA</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to AAIR</h2>
              <p className="text-slate-500 text-center max-w-md mb-8">
                Your expert AI assistant for IATA rules, airline regulations, baggage policies, ticketing, dangerous goods, and more.
              </p>

              {/* Suggested Questions */}
              <div className="w-full max-w-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
                  Try asking about
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all text-sm text-slate-700 hover:text-blue-700 shadow-sm hover:shadow"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-2 mt-8 justify-center">
                {["Baggage Rules", "Ticketing", "Dangerous Goods", "Passenger Rights", "Airline Codes", "Cargo"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3"
                        : "bg-white border border-slate-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">AA</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">AAIR</span>
                      </div>
                    )}
                    <div
                      className={`prose text-sm leading-relaxed ${
                        msg.role === "user" ? "text-white" : "text-slate-700"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: msg.role === "assistant" ? formatMarkdown(msg.content) : msg.content,
                      }}
                    />
                    <div
                      className={`text-[10px] mt-2 ${
                        msg.role === "user" ? "text-blue-200" : "text-slate-300"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">AA</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">AAIR</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-4 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about IATA rules, airline regulations, baggage policies..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-800 placeholder-slate-400 max-h-32"
              style={{ minHeight: "24px" }}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            AAIR provides information based on its knowledge base. Always verify critical information with official IATA publications.
          </p>
        </div>
      </div>
    </div>
  );
}
