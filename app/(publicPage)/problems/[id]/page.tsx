"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Always fetch problem for preview
        const problemRes = await fetch(`/api/frontProblems/${id}`);
        const problemData = await problemRes.json();
        setProblem(problemData);
      } catch (err) {
        console.error("Failed to load problem detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [id]);

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

  return (
    <div className={`py-4 transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>
      <div className="container  mx-auto space-y-6">
        <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{problem?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {problem?.fileUrl && <img src={problem?.fileUrl} className="w-full mb-4" />}
                <EditorRenderer blocks={editorBlocks} />
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
