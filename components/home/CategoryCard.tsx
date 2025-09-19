;import { Category } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  category: Category & { problemCount?: number }; 
  // 👆 extend to include computed field
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer relative overflow-hidden">
      {/* Animated SVG background objects */}
      <svg
        aria-hidden
        className="absolute -top-6 -right-6 w-24 h-24 opacity-20 z-0 animate-spin-slow"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="40" fill="#60a5fa" />
        <circle cx="70" cy="30" r="15" fill="#818cf8" fillOpacity="0.7" />
      </svg>
      <svg
        aria-hidden
        className="absolute -bottom-8 -left-8 w-20 h-20 opacity-10 z-0 animate-pulse"
        viewBox="0 0 100 100"
        fill="none"
      >
        <ellipse cx="50" cy="50" rx="35" ry="20" fill="#f472b6" />
      </svg>
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {category.categoryDescription}
        </p>
        <Badge variant="outline">
          Total: {category.problemCount ?? 0} problems
        </Badge>
      </CardContent>
    </Card>
  );
};

// Add animation classes
// In your global CSS (e.g., styles/globals.css), add:
// @keyframes spin-slow { 100% { transform: rotate(360deg); } }
// .animate-spin-slow { animation: spin-slow 18s linear infinite; }
