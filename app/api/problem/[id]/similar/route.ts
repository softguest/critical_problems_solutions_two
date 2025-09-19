import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const currentSubject = await db.subject.findUnique({ where: { id: params.id } });
  if (!currentSubject) return new Response("Not found", { status: 404 });

  const similar = await db.subject.findMany({
    where: {
      id: { not: params.id },
      title: { contains: currentSubject.title.split(" ")[0], mode: "insensitive" }, // basic similarity
    },
    take: 3,
    select: { id: true, title: true },
  });

  return Response.json(similar);
}
