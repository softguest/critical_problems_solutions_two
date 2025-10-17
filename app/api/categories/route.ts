export const runtime = "nodejs";
// app/api/categories/route.ts

export const preferredRegion = "fra1"; 
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// POST: Create a new category
export async function POST(req: Request) {
  try {
    const body = await req.json(); 

    const { name, categoryDescription, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    // Save category in DB
    const newCategory = await db.category.create({
      data: {
        name,
        categoryDescription,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

// GET: List all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        categoryDescription: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
