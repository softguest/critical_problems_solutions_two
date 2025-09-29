import { Category } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  category: Category & { problemCount?: number; imageUrl?: string }; // imageUrl should be in your Category model
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer relative overflow-hidden min-h-[180px] flex flex-col justify-end"
      style={{
        backgroundImage: category.imageUrl
          ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.26) 40%, rgba(0, 0, 0, 1) 100%), url(${category.imageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 p-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white drop-shadow">{category.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-gray-200 text-sm mb-3 line-clamp-2 drop-shadow">
            {category.categoryDescription}
          </p>
          <Badge variant="outline" className="bg-white/80 text-black font-semibold">
            {category.problemCount ?? 0} problems
          </Badge>
        </CardContent>
      </div>
      {/* Optional: fallback overlay if no image */}
      {!category.imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
      )}
    </Card>
  );
};