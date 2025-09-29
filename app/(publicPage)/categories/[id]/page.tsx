import { db } from "@/lib/db";
import { ProblemCard } from "@/components/home/ProblemCard";

interface CategoryPageProps {
  params: { id: string };
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const category = await db.category.findUnique({
    where: { id: params.id },
    include: {
      problems: {
        orderBy: { createdAt: "desc" },
        include: { category: true, author: true },
      },
    },
  });

  if (!category) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Category Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {category.categoryDescription ?? "Explore problems under this category."}
        </p>
      </div>

      {/* Problems Grid */}
      {category.problems.length === 0 ? (
        <p className="text-center text-muted-foreground">No problems in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
