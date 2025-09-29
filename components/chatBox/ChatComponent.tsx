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
    <div className="md:flex bg-gradient-to-br from-slate-100 to-slate-200 text-black dark:bg-zinc-900 dark:text-white font-sans overflow-x-hidden">
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
          className={`fixed md:static z-30 top-0 left-0 h-full bg-white dark:bg-zinc-800 shadow-lg border-r w-64 p-4 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:block`}
        > 
          <nav className="flex flex-col gap-2 border-b pb-4 mb-4">
            <a
              href="/dashboard/create-problem"
              // onClick={() => setShowModal(false)}
              className="block px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              ➕ Create Problem
            </a>
            <a
              href="/dashboard/problem"
              // onClick={() => setShowModal(false)}
              className="block px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              📄 All Problems
            </a>
            <a
              href="/dashboard/solution"
              // onClick={() => setShowModal(false)}
              className="block px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              💡 All Solutions
            </a>
          </nav>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Chats</h2>
            <button
              onClick={handleNewSession}
              className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
            >
              + New Chat
            </button>
          </div>

          {sessions.map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${
                selectedSessionId === s.id
                  ? "bg-blue-100 dark:bg-zinc-700"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
              onClick={() => {
                setSelectedSessionId(s.id);
                setSidebarOpen(false);
              }}
            >
              <div className="flex items-center gap-2 w-[75%] truncate">
                <MessageSquare size={18} className="text-blue-500 shrink-0" />
                <span className="truncate">{s.title}</span>
              </div>
              <div className="relative group">
                <button
                  className="text-gray-600 hover:text-black p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    const menu = document.getElementById(`menu-${s.id}`);
                    if (menu) menu.classList.toggle("hidden");
                  }}
                >
                  <MoreVertical size={16} />
                </button>
                <div
                  id={`menu-${s.id}`}
                  className="absolute right-0 mt-1 z-10 bg-white dark:bg-zinc-900 border rounded shadow hidden"
                >
                  <button
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-zinc-800 w-full text-left"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const confirmDelete = confirm("Delete this session?");
                      if (!confirmDelete) return;

                      try {
                        await fetch(`/api/chat/sessions/${s.id}`, {
                          method: "DELETE",
                        });
                        setSessions((prev) => prev.filter((sess) => sess.id !== s.id));
                        if (selectedSessionId === s.id) {
                          setSelectedSessionId(null);
                          setChat([]);
                        }
                      } catch (err) {
                        console.error("Error deleting session:", err);
                        alert("Could not delete session.");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat UI */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto p-4 relative">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 pb-28">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex max-w-[80%] gap-3 items-start">
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">AI</div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm border shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-zinc-100 dark:bg-zinc-700 text-black dark:text-white mr-auto"
                    }`}
                  >
                    <div>{msg.content}</div>
                    {/* <div className="text-xs text-gray-200 mt-1 text-right">{formatTime(msg.createdAt)}</div> */}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">U</div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 italic animate-pulse">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">AI</div>
                <span>AI is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div
            className="flex gap-2 items-center w-full px-4 absolute left-0 right-0"
            style={{ bottom: 20 }}
          >
            <input
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none dark:bg-zinc-800"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim() || !selectedSessionId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div> 

    </div>
  );
}
