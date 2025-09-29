// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import dynamic from 'next/dynamic';
// import { Session } from 'next-auth';
// import { OutputData } from '@editorjs/editorjs';

// type FormEditProblemProps = {
//   data: Session | null;
// };

// type Category = {
//   id: string;
//   name: string;
// };

// const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

// const EditProblem = ({ data }: FormEditProblemProps) => {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string;

//   const [title, setTitle] = useState('');
//   const [file, setFile] = useState<File | null>(null);
//   const [fileUrl, setFileUrl] = useState<string | null>(null);
//   const [content, setContent] = useState<OutputData | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch('/api/categories');
//         if (res.ok) {
//           const data = await res.json();
//           setCategories(data.categories || []);
//         }
//       } catch (error) {
//         console.error('Failed to load categories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch problem details
//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const res = await fetch(`/api/problem/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch problem");
//         const problem = await res.json();

//         setTitle(problem.title);
//         setFileUrl(problem.fileUrl || null);

//         // ✅ Ensure valid EditorJS structure
//         const safeContent =
//           problem.content && problem.content.blocks
//             ? problem.content
//             : { blocks: [] };
//         setContent(safeContent);

//         setSelectedCategory(problem.categoryId || '');
//       } catch (err) {
//         console.error("Error fetching problem:", err);
//       }
//     };

//     if (id) fetchProblem();
//   }, [id]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) return alert('Title is required');
//     if (!selectedCategory) return alert('Please select a category');
//     if (!content) return alert('Content is required');

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('content', JSON.stringify(content));
//       formData.append('categoryId', selectedCategory);
//       if (file) formData.append('file', file);

//       const res = await fetch(`/api/problem/${id}`, {
//         method: 'PUT',
//         body: formData,
//       });

//       if (res.ok) {
//         router.push(`/dashboard/problem/${id}`);
//       } else {
//         console.error('Failed to update problem');
//         alert('Error: Could not update problem');
//       }
//     } catch (err) {
//       console.error('Submit error:', err);
//       alert('Something went wrong while updating');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center max-w-4xl mx-auto p-4">
//       <form onSubmit={handleSubmit} className="space-y-4 w-full">
//         {/* Title */}
//         <input
//           type="text"
//           placeholder="Problem title"
//           className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         {/* Category */}
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//         >
//           <option value="">Select a category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         {/* Current image */}
//         {fileUrl && (
//           <div>
//             <p className="text-sm text-gray-500 mb-1">Current Featured Image:</p>
//             <img
//               src={fileUrl}
//               alt="Problem"
//               className="w-full max-h-60 object-contain rounded border"
//             />
//           </div>
//         )}

//         {/* Upload new image */}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setFile(e.target.files?.[0] || null)}
//         />

//         {/* Editor */}
//         {content ? (
//           <Editor data={content} onChange={(data) => setContent(data)} />
//         ) : (
//           <p className="text-sm text-gray-500">Loading editor...</p>
//         )}

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 w-full"
//         >
//           {loading ? 'Updating...' : 'Update Problem'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProblem;


'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<OutputData | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/subjects/${id}`);
        if (!res.ok) throw new Error("Failed to fetch subject");

        const data = await res.json();
        setTitle(data.title);
        setImageUrl(data.image);

        // Only setContent if it's still null
        setContent((prevContent) => {
          if (prevContent) return prevContent;
          return typeof data.content === "string" ? JSON.parse(data.content) : data.content;
        });
      } catch (error) {
        console.error("fetchPost error:", error);
      }
    };

    if (id && content === null) {
      fetchPost();
    }
  }, [id, content]);


  const handleEditorChange = (data: OutputData) => {
    setContent(data);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content) return alert("Content is required.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", JSON.stringify(content));
    if (image) {
      formData.append("file", image);
    }

    const res = await fetch(`/api/subjects/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      router.push("/dashboard/writer");
    } else {
      const err = await res.text();
      console.error("Update failed", err);
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Subject</h1>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          required
        />

        {imageUrl && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Featured Image:</p>
            <img src={imageUrl} alt="Current Post" className="w-full max-h-60 object-contain rounded border" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="block"
        />

        {content ? (
          <Editor data={content} onChange={handleEditorChange} />
        ) : (
          <p className="text-sm text-gray-500">Loading editor...</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
