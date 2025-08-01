"use client"
import { useEffect, useState } from 'react';
import { MoreVertical, MessageSquare } from "lucide-react";

const Sidebar = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [chat, setChat] = useState<{ role: "user" | "ai"; content: string; createdAt?: string }[]>([]);
const [sessions, setSessions] = useState<any[]>([]);
const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

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

  return (
    <div
        className={`sticky top-0 z-30 left-0 h-screen bg-white dark:bg-zinc-800 shadow-lg border-r w-64 p-4 transform transition-transform duration-300 ease-in-out ${
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

        <div className="flex justify-between items-center mt-4 mb-4">
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
  )
}

export default Sidebar

