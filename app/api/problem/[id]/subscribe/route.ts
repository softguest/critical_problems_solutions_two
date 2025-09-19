import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subjectId = params.id;
  const userEmail = session.user.email;

  const user = await db.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if already subscribed
  const existing = await db.subscription.findFirst({
    where: {
      userId: user.id,
      subjectId,
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
  }

  // Create subscription
  await db.subscription.create({
    data: {
      userId: user.id,
      subjectId,
    },
  });

  return NextResponse.json({ message: "Subscribed successfully" });
}
