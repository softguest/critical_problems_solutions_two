import { db } from "@/lib/db";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ message: "Not Authenticated!" }, { status: 401 });
  }

  try {
    // Parse multipart form data
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = JSON.parse(formData.get("content") as string);
    const file = formData.get("file") as File | null;

    // Convert EditorJS content → plain text
    const plainText = extractTextFromEditorJS(content);

    // Generate embedding with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await embeddingModel.embedContent({
      content: { role: "user", parts: [{ text: `${title}\n${plainText}` }] },
    });
    const embedding = result.embedding?.values || [];

    // Handle optional file upload to Cloudinary
    let fileUrl: string | null = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "problems" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(buffer);
      });

      fileUrl = uploadResult.secure_url;
    }

    // Store problem in DB
    const newProblem = await db.problem.create({
      data: {
        title,
        content: JSON.stringify(content),
        authorEmail: session.user.email,
        embedding,
        // extend your schema with a "fileUrl String?" if you want this stored
        ...(fileUrl && { fileUrl }),
      },
    });

    return Response.json({ newProblem }, { status: 200 });
  } catch (error) {
    console.error("Create Problem Error:", error);
    return Response.json({ message: "Something went wrong!" }, { status: 500 });
  }
}

// Helper function
function extractTextFromEditorJS(content: any): string {
  if (!content?.blocks || !Array.isArray(content.blocks)) return "";
  return content.blocks
    .map((block: any) => {
      const { type, data } = block;
      switch (type) {
        case "paragraph":
        case "header":
        case "quote":
          return data?.text;
        case "list":
          return data?.items?.map((item: string, i: number) => `${i + 1}. ${item}`).join("\n");
        case "code":
          return `Code:\n${data?.code}`;
        case "table":
          return data?.content?.map((row: string[]) => row.join(" | ")).join("\n");
        case "checklist":
          return data?.items?.map((i: any) => `${i.checked ? "[x]" : "[ ]"} ${i.text}`).join("\n");
        case "warning":
          return `Warning: ${data?.title} - ${data?.message}`;
        case "delimiter":
          return "---";
        case "image":
          return `Image: ${data?.caption || data?.url}`;
        case "embed":
          return `Embed: ${data?.source || data?.embed || data?.url}`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}
