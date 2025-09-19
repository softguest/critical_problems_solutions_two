"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CategoryForm from "@/components/CategoryForm";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, []);

  async function fetchCategory() {
    const res = await fetch(`/api/categories/${id}`);
    if (res.ok) {
      const data = await res.json();
      setInitialData({
        name: data.name,
        description: data.categoryDescription,
        imageUrl: data.imageUrl,
      });
    }
    setLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      body: formData,
    });
    setSaving(false);

    if (res.ok) {
      router.push("/categories");
    } else {
      alert("Failed to update category");
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">Edit Category</h1>
      <CategoryForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={saving}
        buttonLabel="Update"
      />
    </div>
  );
}
