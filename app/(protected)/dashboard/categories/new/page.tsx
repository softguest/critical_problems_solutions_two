"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoryForm from "@/components/CategoryForm";

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      body: formData,
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
