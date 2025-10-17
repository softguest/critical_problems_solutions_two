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
