"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatComponent() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    setChat((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setChat((prev) => [
        ...prev,
        { role: "ai", content: data.reply || "I didn’t quite get that." },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setChat((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong. Try again." },
      ]);
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
    <div className="bg-white flex flex-col max-w-4xl mx-auto h-[90vh] p-4 border rounded-lg shadow md:mt-[-300px]">
      <h1 className="text-xl font-semibold mb-4">Ask About Any Problem</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
        {chat.map((msg, i) => (
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
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 items-center">
        <input
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
