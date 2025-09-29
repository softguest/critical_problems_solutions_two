"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  categoryDescription: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []); 
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } else {
      alert("Failed to delete category");
    }
  }

  return (
    <div className="container mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/dashboard/categories/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Category
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 border-b">Image</th>
                <th className="text-left p-3 border-b">Name</th>
                <th className="text-left p-3 border-b">Description</th>
                <th className="text-left p-3 border-b">Created At</th>
                <th className="text-right p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl || "/placeholder.png"} // fallback if null
                        alt={cat.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-3 border-b font-medium">{cat?.name}</td>
                  <td className="p-3 border-b text-gray-600">
                      {cat?.categoryDescription?.split(" ").slice(0, 10).join(" ")}
                      {/* {cat?.categoryDescription?.split(" ").length > 10 && "..."} */}
                  </td>
                  {/* <td className="p-3 border-b">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td> */}
                  <td className="p-3 border-b">
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>

                  <td className="p-3 border-b text-right space-x-2">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <Link
                      href={`/dashboard/categories/edit/${cat.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
