// import { auth } from "@/auth";
// import { db } from "@/lib/db";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { cosineSimilarity } from "@/lib/similarity"; // implement this

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const sessionId = searchParams.get("sessionId");

//   if (!sessionId) {
//     return new Response("Missing sessionId", { status: 400 });
//   }

//   const session = await auth();
//   if (!session?.user?.email) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   try {
//     // 1. Fetch messages and pre-attached sources (if any)
//     const messages = await db.chatMessage.findMany({
//       where: { sessionId },
//       orderBy: { createdAt: "asc" },
//       include: { sources: true },
//     });

//     // 2. Fetch embeddings for problems/solutions
//     const problems = await db.problem.findMany({
//       include: { solutions: true },
//     });

//     const problemEmbeddings = problems.map((p) => ({
//       id: p.id,
//       text: p.title + " " + (p.content ?? ""),
//       embedding: p.embedding as number[],
//     }));

//     const embeddingModel = new GoogleGenerativeAIEmbeddings({
//       apiKey: process.env.GOOGLE_API_KEY!,
//       model: "embedding-001",
//     });

//     // 3. Process each assistant message
//     const messagesWithSources = await Promise.all(
//       messages.map(async (msg) => {
//         if (msg.role === "assistant") {
//           // If sources already exist in DB, use them
//           if (msg.sources && msg.sources.length > 0) {
//             return msg;
//           }

//           // Otherwise, regenerate embedding and cache sources
//           const [aiEmbedding] = await embeddingModel.embedDocuments([msg.content]);

//           const similarities = problemEmbeddings.map((p) => ({
//             id: p.id,
//             score: cosineSimilarity(aiEmbedding, p.embedding),
//             text: p.text,
//           }));

//           const topMatches = similarities
//             .sort((a, b) => b.score - a.score)
//             .slice(0, 3);

//           // Cache sources in DB
//           await Promise.all(
//             topMatches.map((src) =>
//               db.chatSource.create({
//                 data: {
//                   messageId: msg.id,
//                   problemId: src.id,
//                   similarity: src.score,
//                 },
//               })
//             )
//           );

//           return {
//             ...msg,
//             sources: topMatches,
//           };
//         }

//         return { ...msg, sources: [] };
//       })
//     );

//     return Response.json({ messages: messagesWithSources });
//   } catch (error) {
//     console.error("Fetch chat messages error:", error);
//     return new Response("Server error", { status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const sessionId = searchParams.get("sessionId");

//   if (!sessionId) {
//     return new Response("Missing sessionId", { status: 400 });
//   }

//   try {
//     // Delete sources first to maintain FK constraints
//     const messages = await db.chatMessage.findMany({
//       where: { sessionId },
//       select: { id: true },
//     });

//     const messageIds = messages.map((m) => m.id);

//     await db.chatSource.deleteMany({
//       where: { messageId: { in: messageIds } },
//     });

//     await db.chatMessage.deleteMany({
//       where: { sessionId },
//     });

//     return new Response("Chat history cleared", { status: 200 });
//   } catch (error) {
//     console.error("Delete chat error:", error);
//     return new Response("Server error", { status: 500 });
//   }
// }

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { cosineSimilarity } from "@/lib/similarity";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Fetch messages and pre-attached sources
    const messages = await db.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      include: { sources: { include: { problem: true } } },
    });

    // Fetch all problems for re-checking embeddings if needed
    const problems = await db.problem.findMany({ include: { solutions: true } });

    const problemEmbeddings = problems.map((p) => ({
      id: p.id,
      text: p.title + " " + (p.content ?? ""),
      embedding: p.embedding as number[],
    }));

    const embeddingModel = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      model: "embedding-001",
    });

    const messagesWithSources = await Promise.all(
      messages.map(async (msg) => {
        if (msg.role === "ai") {
          // If sources exist, just format them
          if (msg.sources && msg.sources.length > 0) {
            return {
              ...msg,
              sources: msg.sources.map((s) => ({
                id: s.problemId,
                title: s.problem.title,
                similarity: s.similarity,
              })),
            };
          }

          // Otherwise, generate embedding and find top sources
          const [aiEmbedding] = await embeddingModel.embedDocuments([msg.content]);

          const similarities = problemEmbeddings.map((p) => ({
            id: p.id,
            score: cosineSimilarity(aiEmbedding, p.embedding),
            text: p.text,
          }));

          const topMatches = similarities.sort((a, b) => b.score - a.score).slice(0, 3);

          // Cache sources in DB
          await Promise.all(
            topMatches.map((src) =>
              db.chatSource.create({
                data: {
                  messageId: msg.id,
                  problemId: src.id,
                  similarity: src.score,
                },
              })
            )
          );

          return { ...msg, sources: topMatches.map((s) => ({ id: s.id, title: s.text, similarity: s.score })) };
        }

        return { ...msg, sources: [] };
      })
    );

    return new Response(JSON.stringify({ messages: messagesWithSources }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
    // Delete sources first to respect FK constraints
    const messages = await db.chatMessage.findMany({
      where: { sessionId },
      select: { id: true },
    });

    const messageIds = messages.map((m) => m.id);

    await db.chatSource.deleteMany({
      where: { messageId: { in: messageIds } },
    });

    await db.chatMessage.deleteMany({
      where: { sessionId },
    });

    return new Response("Chat history cleared", { status: 200 });
  } catch (error) {
    console.error("Delete chat error:", error);
    return new Response("Server error", { status: 500 });
  }
}

