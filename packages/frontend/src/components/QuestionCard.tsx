import { Link } from "react-router-dom";
import type { QuestionDTO } from "@interdex/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { MessageSquare } from "lucide-react";

export function QuestionCard({ question }: { question: QuestionDTO }) {
  return (
    <Link to={`/questions/${question.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <DifficultyBadge difficulty={question.difficulty} />
            {question.category && (
              <span className="text-xs font-medium text-muted-foreground">
                {question.category.name}
              </span>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-base">
            {question.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {question.prompt}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {question.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[11px]">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              {question.answers.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
