"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EditorRenderer } from "@/components/EditorRenderer";
import type { EditorContent } from "@/types/editor";

type Problem = {
  id: string;
  title: string;
  content: string;
  fileUrl: string;
};

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [similarProblems, setSimilarProblems] = useState<{ id: string; title: string }[]>([]);
  const [activeDiv, setActiveDiv] = useState(1);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Check subscription
        // const subRes = await fetch(`/api/problem/${id}/is-subscribed`);
        // const subData = await subRes.json();
        // setSubscribed(subData.subscribed);

        // Always fetch subject for preview
        const problemRes = await fetch(`/api/problem/${id}`);
        const problemData = await problemRes.json();
        setProblem(problemData);

        // if (!subData.subscribed) return;

        // Fetch chat + similar
        // const [chatRes, similarRes] = await Promise.all([
        //   // fetch(`/api/problem/${id}/chat-history`),
        //   fetch(`/api/problem/${id}/similar`)
        // ]);

        // const chatData = await chatRes.json();
        // const similarData = await similarRes.json();

        // setMessages(chatData);
        // setSimilarProblems(similarData);
      } catch (err) {
        console.error("Failed to load problem detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { role: "user", content: input };
    const newMessages: Message[] = [...messages, newMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch(`/api/problem/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed to get reply from AI.");
      const { reply } = await res.json();
      setMessages([...newMessages, { role: "ai", content: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  // const handleSubscribe = async () => {
  //   setSubscribing(true);
  //   try {
  //     const res = await fetch(`/api/problem/${id}/subscribe`, { method: "POST" });
  //     const data = await res.json();
  //     if (res.ok) setSubscribed(true);
  //     else alert(data.error || "Subscription failed");
  //   } catch (err) {
  //     alert("An error occurred while subscribing.");
  //   } finally {
  //     setSubscribing(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  let editorBlocks: EditorContent["blocks"] = [];
  if (problem?.content) {
    try {
      const parsed: EditorContent = typeof problem.content === "string"
        ? JSON.parse(problem.content)
        : problem.content;
      editorBlocks = parsed.blocks;
    } catch (error) {
      console.error("Failed to parse subject content:", error);
    }
  }

  // Slice 30% of blocks if not subscribed
  const previewBlocks = !subscribed
    ? editorBlocks.slice(0, Math.ceil(editorBlocks.length * 0.4))
    : editorBlocks;

  return (
    <div className={`py-4 transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>
      <div className="max-w-8xl mx-auto space-y-6">
        <div className="flex justify-between gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded w-full ${activeDiv === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveDiv(1)}
          >
            Subject Content
          </button>
          {subscribed && (
            <>
              <button
                className={`px-4 py-2 rounded w-full ${activeDiv === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveDiv(2)}
              >
                Ask Any Question
              </button>
              <button
                className={`px-4 py-2 rounded w-full ${activeDiv === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveDiv(3)}
              >
                Similar Subjects
              </button>
            </>
          )}
        </div>

        {/* Tabs Content */}
        <div>
          {activeDiv === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{problem?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {problem?.fileUrl && <img src={problem?.fileUrl} className="w-full mb-4" />}
                <EditorRenderer blocks={previewBlocks} />

                {!subscribed && (
                  <div className="mt-6 text-center border-t pt-6">
                    <p className="text-lg font-semibold mb-4">
                      This subject is for subscribers only.
                    </p>
                    <Button 
                    // onClick={handleSubscribe} 
                    disabled={subscribing}>
                      {subscribing ? "Subscribing..." : "Subscribe to Read Full Content"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeDiv === 2 && subscribed && (
            <Card>
              <CardHeader>
                <CardTitle>Ask about this subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-md ${
                        msg.role === "user"
                          ? "bg-blue-100 text-blue-900 ml-auto max-w-[75%]"
                          : "bg-gray-100 text-gray-800 mr-auto max-w-[75%]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the Subject..."
                    className="flex-grow"
                  />
                  <Button onClick={handleSend}>Send</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeDiv === 3 && subscribed && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Similar Subjects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {similarProblems.length === 0 ? (
                  <p className="text-muted-foreground">No similar Problems found.</p>
                ) : (
                  similarProblems.map((problem) => (
                    <a
                      key={problem.id}
                      href={`/subjects/${problem.id}`}
                      className="block p-2 rounded hover:bg-muted text-blue-600"
                    >
                      {problem?.title}
                    </a>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
