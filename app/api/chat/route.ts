// import { db } from "@/lib/db";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { cosineSimilarity } from "@/lib/similarity";
// import { editorJsToText } from "@/lib/editorjs-utils";
// import { auth } from "@/auth";

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY environment variable is not set.");
// }

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function POST(req: Request) {
//   try {
//     const { message, sessionId } = await req.json();

//     if (!message) {
//       return new Response(JSON.stringify({ error: "Missing message" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // Authenticate user
//     const session = await auth();
//     if (!session?.user?.id) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//     const userId = session.user.id;

//     // Find or create chat session
//     let chatSessionId = sessionId;
//     if (!chatSessionId) {
//       const newSession = await db.chatSession.create({
//         data: { userId, title: "Untitled Chat" },
//       });
//       chatSessionId = newSession.id;
//     }

//     // Save user message
//     await db.chatMessage.create({
//       data: { userId, sessionId: chatSessionId, role: "user", content: message },
//     });

//     // Embed user message
//     const embedModel = genAI.getGenerativeModel({ model: "embedding-001" });
//     const embeddingResult = await embedModel.embedContent(message);
//     const queryEmbedding = embeddingResult.embedding.values;

//     // Fetch problems from DB
//     const problems = await db.problem.findMany({ include: { solutions: true } });

//     // Compute similarity scores
//     const scoredProblems = problems
//       .map((p) => ({
//         ...p,
//         score: cosineSimilarity(queryEmbedding, p.embedding || []),
//       }))
//       .sort((a, b) => b.score - a.score);

//     // Pick top 3
//     const topProblems = scoredProblems.slice(0, 3);

//     let aiReply = "";
//     const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     if (topProblems.length && topProblems[0].score >= 0.75) {
//       // Build prompt with top problem
//       const mainProblem = topProblems[0];
//       const prompt = `
// A user asked: "${message}"

// Here is a matched problem and its solutions:
// Problem: ${mainProblem.title}
// Content: ${editorJsToText(mainProblem.content)}

// Solutions:
// ${mainProblem.solutions
//   .map((s, i) => `${i + 1}. ${editorJsToText(s.content)}`)
//   .join("\n\n")}

// Respond in a helpful, friendly, and clear way.
//       `;

//       const result = await chatModel.generateContent(prompt);
//       aiReply = result.response.text();
//     } else {
//       const fallbackPrompt = `
// You are a helpful assistant that chats with users about their real-life problems.

// If a user greets you or shares something general, respond naturally and ask clarifying questions to identify the underlying problem.

// User: "${message}"
//       `;

//       const result = await chatModel.generateContent(fallbackPrompt);
//       aiReply = result.response.text();
//     }

//     // Save AI reply
//     const aiMessage = await db.chatMessage.create({
//       data: { userId, sessionId: chatSessionId, role: "ai", content: aiReply },
//     });

//     // 💾 Cache ALL top sources
//     if (topProblems.length) {
//       await db.chatSource.createMany({
//         data: topProblems.map((p) => ({
//           messageId: aiMessage.id,
//           problemId: p.id,
//           similarity: p.score,
//         })),
//       });
//     }

//     // Return reply with sources
//     return new Response(
//       JSON.stringify({
//         answer: aiReply,
//         sources: topProblems.map((p) => ({
//           id: p.id,
//           title: p.title,
//           similarity: p.score,
//         })),
//         sessionId: chatSessionId,
//       }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (err) {
//     console.error("Chat error:", err);
//     return new Response(
//       JSON.stringify({ error: "Something went wrong. Try again later." }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }


import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";

// Ensure GEMINI_API_KEY is set
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Robust cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid message" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const userId = session.user.id;

    // Find or create chat session
    let chatSessionId = sessionId;
    if (!chatSessionId) {
      const newSession = await db.chatSession.create({
        data: { userId, title: "Untitled Chat" },
      });
      chatSessionId = newSession.id;
    }

    // Save user message
    await db.chatMessage.create({
      data: { userId, sessionId: chatSessionId, role: "user", content: message },
    });

    // Embed user message
    const embedModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const embeddingResult = await embedModel.embedContent(message);
    const queryEmbedding = embeddingResult.embedding?.values ?? [];

    // Fetch problems from DB
    const problems = await db.problem.findMany({ include: { solutions: true } });

    // Compute similarity scores safely
    const scoredProblems = problems.map((p) => {
      const score = cosineSimilarity(queryEmbedding, p.embedding ?? []);
      return { ...p, score: Number.isFinite(score) ? score : 0 };
    });

    // Pick top 3 problems
    const topProblems = scoredProblems.sort((a, b) => b.score - a.score).slice(0, 3);

    // Prepare AI reply
    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    let aiReply = "";

    if (topProblems.length && topProblems[0].score >= 0.75) {
      const mainProblem = topProblems[0];
      const prompt = `
A user asked: "${message}"

Here is a matched problem and its solutions:
Problem: ${mainProblem.title}
Content: ${mainProblem.content}

Solutions:
${mainProblem.solutions
        .map((s, i) => `${i + 1}. ${s.content}`)
        .join("\n\n")}

Respond in a helpful, friendly, and clear way.
      `;
      const result = await chatModel.generateContent(prompt);
      aiReply = result.response.text();
    } else {
      const fallbackPrompt = `
You are a helpful assistant chatting with users about real-life problems.

User: "${message}"
Respond naturally and ask clarifying questions if needed.
      `;
      const result = await chatModel.generateContent(fallbackPrompt);
      aiReply = result.response.text();
    }

    // Save AI reply
    const aiMessage = await db.chatMessage.create({
      data: { userId, sessionId: chatSessionId, role: "ai", content: aiReply },
    });

    // Cache top sources safely
    const validTopProblems = topProblems.filter((p) => Number.isFinite(p.score));
    if (validTopProblems.length) {
      await db.chatSource.createMany({
        data: validTopProblems.map((p) => ({
          messageId: aiMessage.id,
          problemId: p.id,
          similarity: p.score,
        })),
      });
    }

    // Return response
    return new Response(
      JSON.stringify({
        answer: aiReply,
        sources: validTopProblems.map((p) => ({
          id: p.id,
          title: p.title,
          similarity: p.score,
        })),
        sessionId: chatSessionId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Chat error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
