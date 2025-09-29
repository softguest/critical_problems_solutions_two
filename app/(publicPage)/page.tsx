"use client";
// ❌ Remove "use client" because this is a server component
import { Header } from "@/components/home/Header";
import { ProblemCard } from "@/components/home/ProblemCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import HeroSector from "@/components/home/HeroSector";

export default async function Home() {
  // Fetch problems from the database
  const problems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      category: true,
      author: true
    },
  });

  // ✅ Fetch categories from the database
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
    <div>
      {/* Hero Section */}
        <HeroSector />
        {/* Categories Section */}
        <section className="container pt-24 pb-12 bg-muted/30 rounded-2xl mt-14">
          <div className="mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="ext-md md:text-3xl text-center font-bold">Problem Categories</h2>
              <Button variant="outline" asChild>
                <Link href="/categories">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id}
                  //@ts-ignore
                  category={{
                    ...category,
                    categoryDescription: category?.categoryDescription ?? null,
                    problemCount: category._count.problems // Pass problem count to the card
                  }}
                />
              ))}
            </div>
          </div>
        </section>

      {/* Latest Problems Section */}
        <section className="container py-12 mt-16">
          <div className="mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-md md:text-3xl text-center font-bold">Latest Problems</h2>
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
  );
}
