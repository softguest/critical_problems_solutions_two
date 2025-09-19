// import { auth } from "@/auth";
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   const session = await auth();
//   if (!session || !session.user?.email) return NextResponse.json([], { status: 401 });

//   const user = await db.user.findUnique({
//     where: { email: session.user.email },
//   });

//   if (!user) return NextResponse.json([], { status: 404 });

//   const chat = await db.chat.findFirst({
//     where: { userId: user.id, postId: params.id },
//   });

//   return NextResponse.json(chat?.messages || []);
// }

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const VALID_ROLES = ["user", "ai"] as const;

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return NextResponse.json([], { status: 404 });

  const chat = await db.chat.findFirst({
    where: { userId: user.id, subjectId: params.id },
  });

  // Ensure only valid messages are sent
  const messages =
  Array.isArray(chat?.messages) && chat?.messages.length > 0
    ? chat.messages.filter(
        (m: any) =>
          VALID_ROLES.includes(m.role) && typeof m.content === "string"
      )
    : [];

  return NextResponse.json(messages);
}

