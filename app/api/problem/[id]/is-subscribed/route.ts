import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ subscribed: false }, { status: 200 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  const subscribed = await db.subscription.findFirst({
    where: {
      userId: user?.id,
      subjectId: params.id,
    },
  });

  return NextResponse.json({ subscribed: !!subscribed });
}
