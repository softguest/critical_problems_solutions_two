"use client";
// ❌ Remove "use client" because this is a server component
import { Header } from "@/components/home/Header";
import { ProblemCard } from "@/components/home/ProblemCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function Home() {
  // Fetch problems from the database
  const problems = await db.problem.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      category: true, 
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
      <section className="relative pt-32 pb-48 overflow-hidden">
        {/* background blobs */}
        <style jsx>{`
          .hero-blob {
            position: absolute;
            will-change: transform;
            transition: filter 0.3s;
          }
          .blob1 { animation: blobMove1 16s ease-in-out infinite alternate; }
          .blob2 { animation: blobMove2 18s ease-in-out infinite alternate; }
          .blob3 { animation: blobMove3 20s ease-in-out infinite alternate; }
          .blob4 { animation: blobMove4 22s ease-in-out infinite alternate; }
          .blob5 { animation: blobMove5 24s ease-in-out infinite alternate; }
          @keyframes blobMove1 { 0% { transform: translate(0px,0px);} 100% {transform:translate(30px,40px);} }
          @keyframes blobMove2 { 0% { transform: translate(0px,0px);} 100% {transform:translate(-40px,30px);} }
          @keyframes blobMove3 { 0% { transform: translate(0px,0px);} 100% {transform:translate(25px,-30px);} }
          @keyframes blobMove4 { 0% { transform: translate(0px,0px);} 100% {transform:translate(-30px,-20px);} }
          @keyframes blobMove5 { 0% { transform: translate(0px,0px);} 100% {transform:translate(20px,25px);} }
        `}</style>

        <div aria-hidden className="pointer-events-none absolute inset-0 w-full h-full z-0">
          <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="200" cy="200" r="180" fill="#60a5fa" fillOpacity="0.15" className="hero-blob blob1" />
            <circle cx="1200" cy="100" r="140" fill="#818cf8" fillOpacity="0.13" className="hero-blob blob2" />
            <circle cx="900" cy="400" r="120" fill="#f472b6" fillOpacity="0.10" className="hero-blob blob3" />
            <circle cx="400" cy="500" r="100" fill="#34d399" fillOpacity="0.10" className="hero-blob blob4" />
            <circle cx="1300" cy="500" r="80" fill="#fbbf24" fillOpacity="0.10" className="hero-blob blob5" />
          </svg>  
        </div>

        {/* Hero content */}
        <div className="relative z-10 container mx-auto flex justify-center">
          <div className="w-full max-w-4xl mx-auto rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-zinc-900/40 border border-white/30 dark:border-zinc-700/40 shadow-xl p-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
              Solve Problems with AI-Powered Recommendations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Describe your problem and get tailored solutions instantly. A modern platform where anyone can get solutions powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/create-problem">
                  <Plus className="mr-2 h-4 w-4" />
                  Share a Problem
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/problems">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Explore Problems
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

        {/* Categories Section */}
        <section className="py-12 bg-muted/30 rounded-2xl">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Problem Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id}
                  //@ts-ignore
                  category={{
                    ...category,
                    categoryDescription: category.categoryDescription ?? undefined,
                    problemCount: category._count.problems // Pass problem count to the card
                  }}
                />
              ))}
            </div>
          </div>
        </section>

      {/* Latest Problems Section */}
      <section className="py-12">
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
  );
}
