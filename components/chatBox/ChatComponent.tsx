"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical, MessageSquare } from "lucide-react";

export default function ChatComponent() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; content: string; createdAt?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch("/api/chat/sessions");
      const data = await res.json();
      setSessions(data.sessions);
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedSessionId) return;
      const res = await fetch(`/api/chat/history?sessionId=${selectedSessionId}`);
      const data = await res.json();
      setChat(data.messages);
    };
    fetchMessages();
  }, [selectedSessionId]);

  const handleNewSession = async () => {
    const title = prompt("Enter session title");
    if (!title) return;

    const res = await fetch("/api/chat/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    setSessions((prev) => [data.session, ...prev]);
    setSelectedSessionId(data.session.id);
    setChat([]);
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedSessionId) return;
    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setChat((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId: selectedSessionId }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChat((prev) => [...prev, { role: "ai", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="md:flex bg-white text-black dark:bg-zinc-900 dark:text-white font-sans overflow-x-hidden">
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <div className="md:hidden px-4 mt-2 flex justify-between items-center mb-4 z-30 relative">
        <h1 className="text-xl font-bold">Your AI Helper</h1>
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 border rounded-full shadow-md bg-white dark:bg-zinc-700"
        >
          {sidebarOpen ? "X" : "☰"}
        </button>
      </div>

      <div className="flex relative">
        {/* Sidebar */}
        <div
          className={`fixed md:static z-10 top-0 left-0 h-full bg-zinc-800 border-r border-zinc-700 w-64 p-4 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:block`}
        >
          <nav className="mb-6">
            <h2 className="text-sm font-semibold uppercase text-zinc-400 mb-3">Navigation</h2>
            <div className="flex flex-col gap-2">
              <a href="/dashboard/create-problem" className="text-sm px-3 py-2 rounded-md hover:bg-zinc-700 text-zinc-100">➕ Create Problem</a>
              <a href="/dashboard/problem" className="text-sm px-3 py-2 rounded-md hover:bg-zinc-700 text-zinc-100">📄 All Problems</a>
              <a href="/dashboard/solution" className="text-sm px-3 py-2 rounded-md hover:bg-zinc-700 text-zinc-100">💡 All Solutions</a>
            </div>
          </nav>

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold uppercase text-zinc-400">Chats</h2>
            <button
              onClick={handleNewSession}
              className="text-xs text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
            >
              + New
            </button>
          </div>

          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`flex items-center justify-between p-2 rounded-md text-sm cursor-pointer ${
                  selectedSessionId === s.id ? "bg-zinc-700" : "hover:bg-zinc-800"
                }`}
                onClick={() => {
                  setSelectedSessionId(s.id);
                  setSidebarOpen(false);
                }}
              >
                <div className="truncate w-[75%] text-zinc-100">{s.title}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const confirmDelete = confirm("Delete this session?");
                    if (confirmDelete) {
                      fetch(`/api/chat/sessions/${s.id}`, { method: "DELETE" }).then(() => {
                        setSessions((prev) => prev.filter((sess) => sess.id !== s.id));
                        if (selectedSessionId === s.id) {
                          setSelectedSessionId(null);
                          setChat([]);
                        }
                      });
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div> 


        {/* Chat UI */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto p-4 relative">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 pb-28">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[80%] flex gap-3">
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs">AI</div>
                )}
                <div
                  className={`rounded-xl px-4 py-3 text-sm border border-zinc-700 shadow-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-zinc-800 text-zinc-100 font-mono"
                  }`}
                >
                  {msg.content}
                  <div className="text-[10px] text-zinc-400 mt-1 text-right">{formatTime(msg.createdAt)}</div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">U</div>
                )}
              </div>
            </div>
          ))}


            {loading && (
              <div className="flex items-center gap-2 text-sm text-zinc-400 font-mono animate-pulse">
                <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs">AI</div>
                <span>AI is typing<span className="animate-bounce">...</span></span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input area: center if no messages, bottom if messages */}
          {chat.length === 0 ? (
            <div className="fixed w-[80%] bg-zinc-900 border-t border-zinc-700 px-4 py-3 flex items-center rounded-xl gap-2">
              <input
                className="flex-1 bg-zinc-800 text-white text-sm px-4 py-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ask your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim() || !selectedSessionId}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-40"
              >
                Send
              </button>
            </div>

          ) : (
            <div className="flex items-center bottom-20 w-full bg-zinc-900 border-t border-zinc-700 px-4 py-3 flex items-center rounded-xl gap-2">
              <input
                className="flex-1 bg-zinc-800 text-white text-sm px-4 py-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ask your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim() || !selectedSessionId}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-40"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div> 

    </div>
  );
}
