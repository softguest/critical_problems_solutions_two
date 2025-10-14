// app/api/problem/route.ts
export const runtime = "nodejs";
export const preferredRegion = "fra1"; 

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { title, content, categoryId, fileUrl } = await req.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Extract text for embeddings
    const plainText = extractTextFromEditorJS(content);

    // Generate embedding using Gemini
    let embedding: number[] | undefined = undefined;
    try {
      const model = genAI.getGenerativeModel({ model: "embedding-001" });
      const embeddingRes = await model.embedContent({
        content: { role: "user", parts: [{ text: plainText }] },
      });
      embedding = embeddingRes?.embedding?.values ?? undefined;
    } catch (embedErr) {
      console.error("Embedding error:", embedErr);
    }

    // Save in DB
    const newProblem = await db.problem.create({
      data: {
        title,
        content: JSON.stringify(content),
        authorEmail: session.user.email,
        categoryId,
        embedding,
        ...(fileUrl && { fileUrl }),
      },
    });

    return NextResponse.json({ newProblem });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to create problem" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "6", 10));
    const where = undefined;

    const problems = await db.problem.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: { category: true },
      where,
    });

    let nextCursor: string | null = null;
    if (problems.length > limit) {
      const next = problems.pop();
      nextCursor = next?.id || null;
    }

    return NextResponse.json({ problems, nextCursor });
  } catch (err) {
    console.error("GET /api/problems error:", err);
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 });
  }
}

/**
 * Helper: Convert EditorJS output (blocks) into plain text for embeddings/search.
 * Accepts the parsed EditorJS content object.
 */
function extractTextFromEditorJS(content: any): string {
  if (!content || !Array.isArray(content.blocks)) return "";
  return content.blocks
    .map((block: any) => {
      const { type, data } = block || {};
      switch (type) {
        case "paragraph":
        case "header":
        case "quote":
          return data?.text || "";
        case "list":
          return Array.isArray(data?.items) ? data.items.join("\n") : "";
        case "code":
          return data?.code ? `\n${data.code}\n` : "";
        case "table":
          return Array.isArray(data?.content)
            ? data.content.map((row: any[]) => row.join(" | ")).join("\n")
            : "";
        case "checklist":
          return Array.isArray(data?.items)
            ? data.items.map((i: any) => `${i.checked ? "[x]" : "[ ]"} ${i.text}`).join("\n")
            : "";
        case "image":
          return data?.caption || data?.url || "";
        case "embed":
          return data?.embed || data?.url || "";
        default:
          return typeof data === "string" ? data : "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}