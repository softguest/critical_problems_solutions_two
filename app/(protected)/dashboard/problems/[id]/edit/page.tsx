'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";

type Category = {
  id: string;
  name: string;
};

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<OutputData | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();

  //   // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/problems/${id}`);
        if (!res.ok) throw new Error("Failed to fetch problem");

        const data = await res.json();
        setTitle(data.title);
        setImageUrl(data.image);

        // Always set from DB only if content is empty
        if (!content) {
          const parsedContent =
            typeof data.content === "string" && (data.content.startsWith("{") || data.content.startsWith("["))
              ? JSON.parse(data.content)
              : data.content;

          setContent(data.content); 
          setSelectedCategory(data.categoryId || ""); // also restore category
        }
      } catch (error) {
        console.error("fetchPost error:", error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);



  const handleEditorChange = (data: OutputData) => {
    setContent(data);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
     setLoading(true); 

    if (!content) return alert("Content is required.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", JSON.stringify(content));
    formData.append('categoryId', selectedCategory);
    if (image) {
      formData.append("file", image);
    }

    const res = await fetch(`/api/problems/${id}`, {
      method: "PUT",
      body: formData,
    });
    setLoading(false); 

    if (res.ok) {
      router.push("/dashboard/problems");
    } else {
      const err = await res.text();
      console.error("Update failed", err);
    }
  }

  return (
    <div className="flex justify-center max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full" encType="multipart/form-data">
        <input
          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          required
        />

         {/* Category */}
         <select
           value={selectedCategory}
           onChange={(e) => setSelectedCategory(e.target.value)}
           className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
         >
           <option value="">Select a category</option>
           {categories.map((cat) => (
             <option key={cat.id} value={cat.id}>
               {cat.name}
             </option>
           ))}
         </select>

        {imageUrl && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Featured Image:</p>
            <img src={imageUrl} alt="Current Post" className="w-full max-h-60 object-contain rounded border" />
          </div>
        )}

        {/* <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="block"
        /> */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        {image && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="max-w-xs max-h-40 rounded shadow border"
            />
          </div>
        )}

        {content ? (
          <Editor data={content} onChange={handleEditorChange}/>
        ) : (
          <p className="text-sm text-gray-500">Loading editor...</p>
        )}
        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
              Updating...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
