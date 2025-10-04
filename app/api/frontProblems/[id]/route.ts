import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - fetch a single problem
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Remove authentication check for GET
  const problem = await db.problem.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  // Ensure content is always parsed
  let parsedContent = problem.content;
  if (typeof parsedContent === "string") {
    try {
      parsedContent = JSON.parse(parsedContent);
    } catch {
      parsedContent = { blocks: [] };
    }
  }

  return NextResponse.json({
    ...problem,
    content: parsedContent,
  });
}