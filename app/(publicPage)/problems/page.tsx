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
    });

  return (
    <div className='relative py-8 px-4 overflow-hidden'>
        {/* Latest Problems Section */}
        <section className="py-12 px-4">
            <div className="container mx-auto">
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