"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoryForm from "@/components/CategoryForm";

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
  setSaving(true);

  let imageFile = formData.get("image") as File | null;
  let imageUrl = null;

  if (imageFile) {
    // 1. Get Cloudinary signature
    const sigRes = await fetch("/api/cloudinary/signature");
    const { timestamp, signature, folder } = await sigRes.json();

    // 2. Upload to Cloudinary
    const uploadData = new FormData();
    uploadData.append("file", imageFile);
    uploadData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    uploadData.append("timestamp", timestamp);
    uploadData.append("signature", signature);
    uploadData.append("folder", folder);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadData }
    );

    const uploaded = await cloudinaryRes.json();
    imageUrl = uploaded.secure_url;
  }

  // 3. Prepare final payload
  const payload = {
    name: formData.get("name"),
    description: formData.get("categoryDescription"),
    imageUrl,
  };

  // 4. Submit to backend
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  setSaving(false);

  if (res.ok) {
    router.push("/categories");
  } else {
    const err = await res.json();
    alert(err.error || "Failed to create category");
  }
}


  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">Create New Category</h1>
      <CategoryForm
        onSubmit={handleSubmit}
        loading={saving}
        buttonLabel="Create"
      />
    </div>
  );
}
