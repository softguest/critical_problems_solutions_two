// 

import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cosineSimilarity } from "@/lib/cosine";

export async function POST(req: Request) {
  const { message } = await req.json();
  if (!message) {
    return Response.json({ error: "Missing message" }, { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    // 1. Generate embedding
    const embeddingResult = await genAI
      .getGenerativeModel({ model: "embedding-001" })
      .embedContent({
        content: {
          role: "user",
          parts: [{ text: message }],
        },
      });

    const queryEmbedding = embeddingResult.embedding?.values || [];

    // 2. Search DB
    const problems = await db.problem.findMany({ include: { solutions: true } });

    const topMatch = problems
      .map((p) => ({
        ...p,
        score: cosineSimilarity(queryEmbedding, p.embedding),
      }))
      .sort((a, b) => b.score - a.score)[0];

    if (topMatch && topMatch.score >= 0.75) {
      // Use Gemini to summarize best matched problem + solutions
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
      const output = reply.response.text();
      return Response.json({ reply: output });
    } else {
      // Fall back to normal Gemini chat
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
      const output = fallback.response.text();
      return Response.json({ reply: output });
    }
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ reply: "Something went wrong. Try again later." }, { status: 500 });
  }
}
