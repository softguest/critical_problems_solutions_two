import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { auth } from "@/auth";

// GET - fetch a single problem
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const problem = await db.problem.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json(problem);
}

// PUT - update problem
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const categoryId = formData.get("categoryId") as string;
  const contentRaw = formData.get("content") as string;
  const content = contentRaw ? JSON.parse(contentRaw) : { blocks: [] };
  const file = formData.get("file") as File | null;

  const problem = await db.problem.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  if (problem.authorEmail !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let newImageUrl = problem.fileUrl;

  if (file && file.name) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    newImageUrl = `/uploads/${fileName}`;

    if (problem.fileUrl) {
      const oldImagePath = path.join(process.cwd(), "public", problem.fileUrl.replace(/^\/+/, ""));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }
  }

  const updatedProblem = await db.problem.update({
    where: { id: params.id },
    data: {
      title,
      content,         // ✅ JSON type
      categoryId,      // update category
      fileUrl: newImageUrl,
    },
  });

  return NextResponse.json(updatedProblem);
}
