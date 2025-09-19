"use client";

import { useState, useEffect } from "react";

type CategoryFormProps = {
  initialData?: {
    name: string;
    description?: string;
    imageUrl?: string | null;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  loading?: boolean;
  buttonLabel?: string;
};

export default function CategoryForm({
  initialData,
  onSubmit,
  loading = false,
  buttonLabel = "Create",
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryDescription", description);
    if (image) {
      formData.append("image", image);
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <input
          type="text"
          className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="mt-1"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        {preview && (
          <div className="mt-3">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
      >
        {loading ? "Saving..." : buttonLabel}
      </button>
    </form>
  );
}
