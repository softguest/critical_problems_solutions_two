import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import cloudinary from "cloudinary";

// Configure Cloudinary (make sure env vars are set)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const categoryDescription = formData.get("categoryDescription") as string;
    const file = formData.get("image") as File | null;

    let imageUrl: string | null = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded = await new Promise<cloudinary.UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream({ folder: "categories" }, (err, result) => {
              if (err || !result) reject(err);
              else resolve(result);
            })
            .end(buffer);
        }
      );

      imageUrl = uploaded.secure_url;
    }

    const newCategory = await db.category.create({
      data: {
        name,
        categoryDescription,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}


export async function GET() {
  const categories = await db.category.findMany({
    select: { id: true, name: true, categoryDescription: true, imageUrl: true, createdAt: true },
  });
  return NextResponse.json({ categories });
}
