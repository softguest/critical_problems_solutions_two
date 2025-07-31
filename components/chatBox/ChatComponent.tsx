"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

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
    <div className="md:flex h-screen bg-white text-black dark:bg-zinc-900 dark:text-white">
      {/* Mobile Toggle Button */}
      <div className="md:hidden px-4 mt-2 flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your AI Helper</h1>
        <button
          // onClick={() => setSidebarOpen(true)}
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 border rounded-full shadow-md bg-white dark:bg-zinc-700"
        >
          {sidebarOpen ? "X" : "☰"}
        </button>
      </div>

      {/* <button
        className="md:hidden mb-2 mx-4 bg-gray-200 px-4 py-2 rounded"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        {sidebarOpen ? "Hide Sessions" : "Show Sessions"}
      </button> */}

      {/* Sidebar */}
      <div
        className={`fixed md:static z-30 md:z-0 top-0 left-0 h-full bg-white dark:bg-zinc-800 shadow-lg border-r w-64 p-4 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
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
            onClick={() => setSelectedSessionId(s.id)}
          >
            <span className="truncate w-[75%]">{s.title}</span>
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
                className="absolute right-0 mt-1 z-10 bg-white border rounded shadow hidden"
              >
                <button
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left"
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
        {/* <h1 className="text-xl font-semibold mb-4">Ask About Any Problem</h1> */}

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 pb-28">
          {/* {chat.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-100 text-right ml-auto max-w-[80%]"
                  : "bg-gray-100 text-left mr-auto max-w-[80%]"
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={chatEndRef} /> */}
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex max-w-[80%] gap-3 items-start">
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                    AI
                  </div>
                )}
                <div
                  className={`rounded-xl shadow-sm px-4 py-3 text-sm border ${
                    msg.role === "user"
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100 dark:bg-zinc-800"
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className="text-xs text-gray-400 mt-1 text-right">{formatTime(msg.createdAt)}</div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    U
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-gray-400 italic">AI is thinking…</div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div
          className="flex gap-2 items-center w-full px-4 md:px-0 absolute left-0 right-0"
          style={{ bottom: 20 }}
        >
          <input
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !selectedSessionId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
