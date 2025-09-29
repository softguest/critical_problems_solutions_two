import React from 'react';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CategoryCard } from '@/components/home/CategoryCard';
// import { ProblemCard } from '@/components/home/ProblemCard';

const Categories = async () => {

  // Fetch problems from the database
  const categories = await db.category.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      _count: {
        select: { problems: true }
      }
    }
  });

  return (
    <div className='relative py-8 overflow-hidden'>
        {/* Categories Section */}
        <section className="container py-12 bg-muted/30 rounded-2xl ">
            <div className="mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Problem Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            //@ts-ignore
                            category={{
                              ...category,
                              //@ts-ignore
                              categoryDescription: category.categoryDescription ?? undefined,
                              problemCount: category._count.problems // Pass problem count to the card
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    </div>
  )
}

export default Categories