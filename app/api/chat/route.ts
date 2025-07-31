// import { db } from "@/lib/db";
// import { auth } from "@/auth";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { cosineSimilarity } from "@/lib/cosine";

// export async function POST(req: Request) {
//   const { message } = await req.json();
//   const session = await auth();

//   if (!session?.user?.id || !message) {
//     return Response.json({ error: "Not authenticated or missing message" }, { status: 400 });
//   }

//   const userId = session.user.id;
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//   const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   try {
//     // Save user message
//     await db.chatMessage.create({
//       data: {
//         userId,
//         role: "user",
//         content: message,
//       },
//     });

//     // Generate embedding
//     const embeddingResult = await genAI
//       .getGenerativeModel({ model: "embedding-001" })
//       .embedContent({
//         content: {
//           role: "user",
//           parts: [{ text: message }],
//         },
//       });

//     const queryEmbedding = embeddingResult.embedding?.values || [];
//     const problems = await db.problem.findMany({ include: { solutions: true } });

//     const topMatch = problems
//       .map((p) => ({
//         ...p,
//         score: cosineSimilarity(queryEmbedding, p.embedding),
//       }))
//       .sort((a, b) => b.score - a.score)[0];

//     let aiReply = "";

//     if (topMatch && topMatch.score >= 0.75) {
//       const prompt = `
// A user asked: "${message}"

// Here is a matched problem and its solutions:
// Problem: ${topMatch.title}
// Content: ${topMatch.content}

// Solutions:
// ${topMatch.solutions.map((s, i) => `${i + 1}. ${s.content}`).join("\n\n")}

// Respond in a helpful, friendly, and clear way.
// `;
//       const reply = await chatModel.generateContent(prompt);
//       aiReply = reply.response.text();
//     } else {
//       const fallbackPrompt = `
// You're an assistant helping users talk about real-life issues. Respond conversationally.

// User: "${message}"
// `;
//       const reply = await chatModel.generateContent(fallbackPrompt);
//       aiReply = reply.response.text();
//     }

//     // Save AI reply
//     await db.chatMessage.create({
//       data: {
//         userId,
//         role: "ai",
//         content: aiReply,
//       },
//     });

//     return Response.json({ reply: aiReply });
//   } catch (error) {
//     console.error("Chat error:", error);
//     return Response.json({ reply: "Something went wrong. Try again later." }, { status: 500 });
//   }
// }


import { db } from "@/lib/db";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cosineSimilarity } from "@/lib/cosine";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return Response.json({ error: "Missing message" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {

    let session = await db.chatSession.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      session = await db.chatSession.create({
        data: { userId, title: "Untitled Chat" },
      });
    }
    // 💾 Save user message
    await db.chatMessage.create({
      data: {
        userId,
        sessionId: session.id,
        role: "user",
        content: message,
      },
    });

    // 🔍 Embed message
    const embeddingResult = await genAI
      .getGenerativeModel({ model: "embedding-001" })
      .embedContent({
        content: {
          role: "user",
          parts: [{ text: message }],
        },
      });

    const queryEmbedding = embeddingResult.embedding?.values || [];

    // 📚 Search problems
    const problems = await db.problem.findMany({ include: { solutions: true } });

    const topMatch = problems
      .map((p) => ({
        ...p,
        score: cosineSimilarity(queryEmbedding, p.embedding),
      }))
      .sort((a, b) => b.score - a.score)[0];

    let output = "";

    if (topMatch && topMatch.score >= 0.75) {
      const prompt = `
        A user asked: "${message}"

        Here is a matched problem and its solutions:
        Problem: ${topMatch.title}
        Content: ${topMatch.content}

        Solutions:
        ${topMatch.solutions.map((s, i) => `${i + 1}. ${s.content}`).join("\n\n")}

        Respond in a helpful, friendly, and clear way.
      `;

      const reply = await chatModel.generateContent(prompt);
      output = reply.response.text();
    } else {
      const fallbackPrompt = `
        You are a helpful assistant that chats with users about their real-life problems and offers relevant support.

        If a user greets you or shares something general, respond naturally and steer the conversation toward discovering whether they are experiencing any specific problems they'd like help with.

        Your goal is to identify the underlying problem they’re describing and compare it semantically (by meaning, not just keywords) to known problems stored in a database.

        If there's a semantically similar match, respond by using the solutions tied to that matched problem.

        If there's no match, let the user know that you're still learning or collecting more data, and ask more clarifying questions or suggest similar problems to help narrow it down.

        Always ask clear, supportive follow-up questions to help the user describe their problem better. Be empathetic, professional, and concise. Your role is to guide, not rush.

        User: "${message}"
      `;

      const fallback = await chatModel.generateContent(fallbackPrompt);
      output = fallback.response.text();
    }

    // 💾 Save AI reply
    await db.chatMessage.create({
      data: {
        userId,
        sessionId: session.id,
        role: "ai",
        content: output,
      },
    });

    return Response.json({ reply: output });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ reply: "Something went wrong. Try again later." }, { status: 500 });
  }
}
