import React from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProblemCard } from '@/components/home/ProblemCard';

const Problems = async () => {

    // Fetch problems from the database
    const problems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      category: true,
    },
    });

  return (
    <div className='relative overflow-hidden'>
        {/* Latest Problems Section */}
        <section className="py-12">
            <div className=" mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Latest Problems</h2>
                    <Button variant="outline" asChild>
                        <Link href="/problems">View All</Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {problems.map((problem) => (
                    <ProblemCard key={problem.id} problem={problem} />
                    ))}
                </div>
            </div>
      </section>
    </div>
  )
}

export default Problems

// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { ProblemCard } from '@/components/home/ProblemCard';

// type Category = {
//   id: string;
//   name: string;
// };

// type Problem = {
//   id: string;
//   title: string;
//   createdAt: string;
//   category?: Category | null;
//   fileUrl?: string | null;
// };

// const Problems = () => {
//   const [problems, setProblems] = useState<Problem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [nextCursor, setNextCursor] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(true);

//   const loaderRef = useRef<HTMLDivElement | null>(null);

//   const fetchProblems = useCallback(async (cursor?: string) => {
//     if (loading) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`/api/problems?limit=6${cursor ? `&cursor=${cursor}` : ''}`);
//       if (!res.ok) throw new Error('Failed to fetch problems');
//       const data = await res.json();

//       setProblems((prev) => [...prev, ...data.problems]);
//       setNextCursor(data.nextCursor);
//       setHasMore(!!data.nextCursor);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [loading]);

//   // Initial fetch
//   useEffect(() => {
//     fetchProblems();
//   }, [fetchProblems]);

//   // Infinite scroll observer
//   useEffect(() => {
//     if (!loaderRef.current || !hasMore) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && nextCursor) {
//           fetchProblems(nextCursor);
//         }
//       },
//       { threshold: 1.0 }
//     );

//     observer.observe(loaderRef.current);
//     return () => observer.disconnect();
//   }, [nextCursor, hasMore, fetchProblems]);

//   return (
//     <div className="relative overflow-hidden">
//       <section className="py-12">
//         <div className="mx-auto">
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-3xl font-bold">Latest Problems</h2>
//             <Button variant="outline" asChild>
//               <Link href="/problems">View All</Link>
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {problems.map((problem) => (
//               <ProblemCard key={problem.id} problem={problem} />
//             ))}
//           </div>

//           {/* Loader / Sentinel */}
//           {loading && <p className="text-center mt-4">Loading...</p>}
//           <div ref={loaderRef} className="h-10"></div>
//           {!hasMore && (
//             <p className="text-center mt-4 text-gray-500">No more problems</p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Problems;
