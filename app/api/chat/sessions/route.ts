import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title } = await req.json();
  if (!title) {
    return new Response("Title is required", { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    const newSession = await db.chatSession.create({
      data: {
        title,
        userId: user!.id,
      },
    });

    return Response.json({ session: newSession });
  } catch (error) {
    console.error("Create session error:", error);
    return new Response("Server error", { status: 500 });
  }
}


export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    const sessions = await db.chatSession.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ sessions });
  } catch (error) {
    console.error("Fetch sessions error:", error);
    return new Response("Server error", { status: 500 });
  }
}
