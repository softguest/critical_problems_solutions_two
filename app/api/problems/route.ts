// app/api/problem/route.ts
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
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = JSON.parse(formData.get("content") as string);
    const categoryId = formData.get("categoryId") as string;
    const file = formData.get("file") as File | null;

    if (!title || !content || !categoryId) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    let fileUrl: string | null = null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "problems" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(buffer);
      });
      fileUrl = result.secure_url;
    }

    // 1. Extract plain text for embedding
    const plainText = extractTextFromEditorJS(content);

    // 2. Generate embedding using Gemini (GoogleGenerativeAI)
    let embedding: number[] | undefined = undefined;
    try {
      const model = genAI.getGenerativeModel({ model: "embedding-001" });
      const embeddingRes = await model.embedContent({
        content: {
          role: "user",
          parts: [{ text: plainText }],
        },
      });
      embedding = embeddingRes?.embedding?.values ?? undefined;
    } catch (embedErr) {
      console.error("Embedding error:", embedErr);
    }

    // 3. Store embedding in the database
    const newProblem = await db.problem.create({
      data: {
        title,
        content: JSON.stringify(content),
        authorEmail: session.user.email,
        ...(fileUrl && { fileUrl }),
        categoryId,
        embedding, // Save embedding for semantic search
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