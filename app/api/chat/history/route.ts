// import { auth } from "@/auth";
// import { db } from "@/lib/db";

// export async function GET() {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return Response.json({ messages: [] });
//   }

//   const messages = await db.chatMessage.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "asc" },
//     select: { role: true, content: true },
//   });

//   return Response.json({ messages });
// }

// export async function DELETE() {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return Response.json({ message: "Not authenticated" }, { status: 401 });
//   }

//   await db.chatMessage.deleteMany({
//     where: { userId: session.user.id },
//   });

//   return Response.json({ message: "Chat history cleared" }, { status: 200 });
// }

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const messages = await db.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    return Response.json({ messages });
  } catch (error) {
    console.error("Fetch chat messages error:", error);
    return new Response("Server error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400 });
  }

  try {
    await db.chatMessage.deleteMany({
      where: { sessionId },
    });

    return new Response("Chat history cleared", { status: 200 });
  } catch (error) {
    console.error("Delete chat error:", error);
    return new Response("Server error", { status: 500 });
  }
}
