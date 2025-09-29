// import {db} from '@/lib/db';
// import Link from 'next/link';
// import EditorJsRenderer from "@/components/EditorRenderer";

// const ProblemsPage = async () => {
//   const problems = await db.problem.findMany({
//     orderBy: {
//       createdAt: 'desc',
//     },
//     include: {
//       author: true,
//     },
//   });

//   return (
//     <div className='max-w-4xl mx-auto py-8 px-4'>
//       <h1 className='text-3xl font-bold mb-4'>Problems</h1>
//       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
//         {problems.map((problem) => (
//           <Link
//             key={problem.id}
//             href={`/dashboard/problem/${problem.id}`}
//             className='bg-white p-4 rounded-md shadow-md'
//           >
//             <h2 className='text-xl font-bold bg-slate-100 p-2 mb-4'>{problem.title}</h2>
//             <EditorJsRenderer content={problem.content} />
//             <p>Published by: {problem.author?.firstName} {problem.author?.lastName}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProblemsPage;



import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Edit2, View } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default async function WriterDashboard() {

  const session = await auth();

  // if (session?.user.role !== "WRITER") {
  //   return <div className="p-4">Access denied.</div>;
  // }

  const problems = await db.problem.findMany({
    where: { author: { email: session?.user.email! } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Problems</h1>
          <Link
            href="/dashboard/problems/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Problem
          </Link>
        </div>

        <ul className="space-y-4">
          {problems.map((problem) => (
            <li key={problem.id}>
              <Card className="p-4 border rounded">
                <div className="flex justify-between items-center">
                  <Link href={`/dashboard/problems/${problem.id}`} className="flex space-x-4">
                    <Image
                      src={problem?.fileUrl ?? "/course/subject.jpg"}
                      alt="Post image"
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-medium">{problem.title}</h2>
                      <p className="text-sm text-gray-600">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                  <div className="flex space-x-4">
                    <Link
                      href={`/problems/${problem.id}`}
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <View size={20} className="inline-block mr-1" />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/problems/${problem.id}/edit`}
                      className="flex items-center text-red-500 hover:underline"
                    >
                      <Edit2 size={16} className="inline-block mr-1" />
                      Edit
                    </Link>
                  </div>
                </div>
              </Card>
            </li>

          ))}
        </ul>
      </div>
    </div>
  );
}
