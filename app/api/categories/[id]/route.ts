// import { NextResponse } from "next/server";
// import {db}from "@/lib/db";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// // Get single category
// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const category = await db.category.findUnique({
//       where: { id: params.id },
//     });

//     if (!category) {
//       return NextResponse.json({ error: "Category not found" }, { status: 404 });
//     }

//     return NextResponse.json(category);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
//   }
// }

// // Update category
// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const formData = await req.formData();
//     const name = formData.get("name") as string;
//     const categoryDescription = formData.get("categoryDescription") as string;
//     const file = formData.get("image") as File | null;

//     let imageUrl: string | null = null;

//     if (file && file.size > 0) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const uploadResult = await new Promise<any>((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream({ folder: "categories" }, (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           })
//           .end(buffer);
//       });

//       imageUrl = uploadResult.secure_url;
//     }

//     const category = await db.category.update({
//       where: { id: params.id },
//       data: {
//         name,
//         categoryDescription,
//         ...(imageUrl && { imageUrl }), // update only if new image
//       },
//     });

//     return NextResponse.json(category);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
//   }
// }

// // Delete already exists above
// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await db.category.delete({
//       where: { id: params.id },
//     });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
//   }
// }


import { db } from "@/lib/db";

// GET single category
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const category = await db.category.findUnique({
      where: { id: params.id },
    });
    if (!category) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(category);
  } catch (err) {
    console.error("Get category error:", err);
    return Response.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

// PUT update category
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const categoryDescription = formData.get("categoryDescription") as string;
    const imageUrl = formData.get("imageUrl") as string | null; // assume Cloudinary already handled

    const updated = await db.category.update({
      where: { id: params.id },
      data: {
        name,
        categoryDescription,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });

    return Response.json(updated);
  } catch (err) {
    console.error("Update category error:", err);
    return Response.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.category.delete({ where: { id: params.id } });
    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete category error:", err);
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
