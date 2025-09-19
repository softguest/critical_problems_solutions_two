import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { auth } from "@/auth"; // <-- Import auth


// GET - Fetch a post only if the user has subscribed
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const problemId = params.id;

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    include: {
      author: true,
    },
  });

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json(problem);
}

// PUT - Update a post
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const file = formData.get("file") as File | null;

  const problem = await db.problem.findUnique({
    where: { id: params.id },
    include: {
      author: true,
    },
  });

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (problem.authorEmail !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }


  let newImageUrl = problem.fileUrl;

  // Handle image upload
  if (file && file.name) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    newImageUrl = `/uploads/${fileName}`;

    // Delete old image
    if (problem.fileUrl) {
      const oldImagePath = path.join(process.cwd(), "public", problem.fileUrl.replace(/^\/+/, ''));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  const updatedProblem = await db.problem.update({
    where: { id: params.id },
    data: {
      title,
      content,
      fileUrl: newImageUrl,
    },
  });

  return NextResponse.json(updatedProblem);
}
