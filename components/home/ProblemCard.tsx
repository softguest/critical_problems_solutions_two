import { Problem, User, Category } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface ProblemCardProps {
  problem: Problem & {
    author?: User | null;
    category?: Category | null;
    excerpt?: string;   // optional computed field
    readTime?: number;  // optional computed field
  };
}

export const ProblemCard = ({ problem }: ProblemCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Link href={`/problems/${problem.id}`}>
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
                {problem.title}
              </h3>
            </Link>
            {problem.category && (
              <Badge variant="secondary" className="w-fit">
                {problem.category.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
          {/* {problem.excerpt ??
            (problem.content
              ? problem.content.slice(0, 120) + "..."
              : "No description available")} */}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <UserIcon className="h-3 w-3" />
              <span>{problem.author?.firstName ?? "Anonymous"}</span>
            </div>
            {problem.readTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{problem.readTime} min read</span>
              </div>
            )}
          </div>
          <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
