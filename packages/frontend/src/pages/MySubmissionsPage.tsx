import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyQuestions } from "@/api/questions";
import { PageSpinner } from "@/components/Spinner";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Pagination } from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export function MySubmissionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyQuestions(page);

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My submissions</h1>
          <p className="text-muted-foreground">
            Track the review status of questions you've submitted.
          </p>
        </div>
        <Button asChild>
          <Link to="/submit">
            <Plus className="h-4 w-4" /> New submission
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((q) => (
            <Link key={q.id} to={`/questions/${q.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={q.status} />
                    <DifficultyBadge difficulty={q.difficulty} />
                    {q.category && (
                      <span className="text-xs text-muted-foreground">
                        {q.category.name}
                      </span>
                    )}
                  </div>
                  <p className="font-medium">{q.title}</p>
                  {q.reviewNote && (
                    <p className="text-sm text-muted-foreground">
                      Reviewer note: {q.reviewNote}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(q.createdAt)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
          <div className="pt-4">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
          You haven't submitted any questions yet.
        </div>
      )}
    </div>
  );
}
