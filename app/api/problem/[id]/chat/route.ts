import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { GeminiChat } from "@/lib/gemini";

function extractTextFromEditorBlocks(content: any): string {
  if (!content || !content.blocks) return "";

  return content.blocks
    .map((block: any) => {
      switch (block.type) {
        case "paragraph":
        case "header":
          return block.data.text;
        case "list":
          return block.data.items.join("\n");
        case "checklist":
          return block.data.items.map((item: any) => `- [${item.checked ? "x" : " "}] ${item.text}`).join("\n");
        case "code":
          return `\nCode:\n${block.data.code}\n`;
        default:
          return ""; // skip unknown block types
      }
    })
    .join("\n\n");
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { messages } = await req.json();

  const subject = await db.subject.findUnique({
    where: { id: params.id },
  });

  if (!subject)
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });

  let context = "";
  try {
    const parsedContent = typeof subject.content === "string"
      ? JSON.parse(subject.content)
      : subject.content;

    context = extractTextFromEditorBlocks(parsedContent);
  } catch (e) {
    console.error("Failed to parse content:", e);
  }

  const reply = await GeminiChat(messages, context);
  

  await db.chat.upsert({
    where: {
      userId_subjectId: { userId: user.id, subjectId: params.id },
    },
    create: {
      userId: user.id,
      subjectId: params.id,
      messages: [...messages, { role: "ai", content: reply }],
    },
    update: {
      messages: [...messages, { role: "ai", content: reply }],
    },
  });

  return NextResponse.json({ reply });
}
