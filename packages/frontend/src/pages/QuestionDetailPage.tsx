import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { AnswerContentType } from "@interdex/shared";
import { useAddAnswer, useQuestion } from "@/api/questions";
import { useAuthStore } from "@/store/authStore";
import { PageSpinner } from "@/components/Spinner";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { AnswerView } from "@/components/AnswerView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnswerComposer } from "@/components/AnswerComposer";
import { toast } from "@/store/toastStore";
import { getApiErrorMessage } from "@/api/client";
import { formatDate } from "@/lib/utils";

export function QuestionDetailPage() {
  const { id } = useParams();
  const { data: question, isLoading } = useQuestion(id);
  const user = useAuthStore((s) => s.user);
  const [showComposer, setShowComposer] = useState(false);
  const addAnswer = useAddAnswer(id!);

  if (isLoading) return <PageSpinner />;
  if (!question) {
    return (
      <div className="container py-16 text-center text-muted-foreground">
        Question not found.
      </div>
    );
  }

  const isOwner = user?.id === question.createdBy?.id;
  const canSeeReviewInfo = isOwner || user?.role === "ADMIN";

  async function handleAddAnswer(input: {
    contentType: AnswerContentType;
    textContent?: string;
    codeContent?: string;
    codeLanguage?: string;
  }) {
    try {
      await addAnswer.mutateAsync(input);
      toast({
        title: "Answer submitted",
        description: "It will appear once an admin approves it.",
        variant: "success",
      });
      setShowComposer(false);
    } catch (err) {
      toast({
        title: "Failed to submit answer",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <Link
        to={question.category ? `/categories/${question.category.slug}` : "/"}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to{" "}
        {question.category?.name ?? "questions"}
      </Link>

      {canSeeReviewInfo && question.status !== "APPROVED" && (
        <Card className="mb-6 border-warning/40 bg-warning/5">
          <CardContent className="flex flex-col gap-1 p-4 text-sm">
            <div className="flex items-center gap-2 font-medium">
              This submission is <StatusBadge status={question.status} />
            </div>
            {question.reviewNote && (
              <p className="text-muted-foreground">
                Reviewer note: {question.reviewNote}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={question.difficulty} />
        {question.category && (
          <Badge variant="secondary">{question.category.name}</Badge>
        )}
        {question.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="mb-3 text-2xl font-bold tracking-tight">
        {question.title}
      </h1>
      <p className="mb-2 whitespace-pre-wrap leading-relaxed text-muted-foreground">
        {question.prompt}
      </p>
      <p className="mb-10 text-xs text-muted-foreground">
        Submitted by {question.createdBy?.name ?? "Unknown"} &middot;{" "}
        {formatDate(question.createdAt)}
      </p>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {question.answers.length} Answer
          {question.answers.length === 1 ? "" : "s"}
        </h2>
        {user && question.status === "APPROVED" && !showComposer && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComposer(true)}
          >
            <Plus className="h-4 w-4" /> Add an answer
          </Button>
        )}
      </div>

      {showComposer && (
        <div className="mb-6">
          <AnswerComposer
            onSubmit={handleAddAnswer}
            onCancel={() => setShowComposer(false)}
            isSubmitting={addAnswer.isPending}
          />
        </div>
      )}

      <div className="space-y-4">
        {question.answers.length === 0 && !showComposer && (
          <p className="text-sm text-muted-foreground">No answers yet.</p>
        )}
        {question.answers.map((answer) => (
          <AnswerView
            key={answer.id}
            answer={answer}
            showStatus={canSeeReviewInfo}
          />
        ))}
      </div>
    </div>
  );
}
