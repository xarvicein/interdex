import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import type { ReviewStatus } from "@interdex/shared";
import {
  useDecideAnswer,
  useDecideQuestion,
  useReviewAnswerQueue,
  useReviewQuestionQueue,
} from "@/api/review";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { AnswerView } from "@/components/AnswerView";
import { Pagination } from "@/components/Pagination";
import { PageSpinner } from "@/components/Spinner";
import { toast } from "@/store/toastStore";
import { getApiErrorMessage } from "@/api/client";
import { formatDate } from "@/lib/utils";

const STATUSES: ReviewStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export function AdminReviewPage() {
  const [resource, setResource] = useState<"questions" | "answers">(
    "questions",
  );
  const [status, setStatus] = useState<ReviewStatus>("PENDING");
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState<{
    id: string;
    kind: "questions" | "answers";
  } | null>(null);
  const [note, setNote] = useState("");

  const questionQueue = useReviewQuestionQueue(status, page, 10);
  const answerQueue = useReviewAnswerQueue(status, page, 10);
  const decideQuestion = useDecideQuestion();
  const decideAnswer = useDecideAnswer();

  const activeQueue = resource === "questions" ? questionQueue : answerQueue;

  async function approve(id: string) {
    try {
      if (resource === "questions")
        await decideQuestion.mutateAsync({ id, decision: "approve" });
      else await decideAnswer.mutateAsync({ id, decision: "approve" });
      toast({ title: "Approved", variant: "success" });
    } catch (err) {
      toast({
        title: "Action failed",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  async function confirmReject() {
    if (!rejectTarget) return;
    try {
      if (rejectTarget.kind === "questions") {
        await decideQuestion.mutateAsync({
          id: rejectTarget.id,
          decision: "reject",
          note,
        });
      } else {
        await decideAnswer.mutateAsync({
          id: rejectTarget.id,
          decision: "reject",
          note,
        });
      }
      toast({ title: "Rejected", variant: "success" });
      setRejectTarget(null);
      setNote("");
    } catch (err) {
      toast({
        title: "Action failed",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Review queue</h1>
      <p className="mb-8 text-muted-foreground">
        Approve or reject community-submitted questions and answers.
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={resource}
          onValueChange={(v) => {
            setResource(v as "questions" | "answers");
            setPage(1);
          }}
        >
          <TabsList>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="answers">Answers</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ReviewStatus);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeQueue.isLoading ? (
        <PageSpinner />
      ) : resource === "questions" ? (
        questionQueue.data && questionQueue.data.items.length > 0 ? (
          <div className="space-y-4">
            {questionQueue.data.items.map((q) => (
              <Card key={q.id}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={q.difficulty} />
                    {q.category && (
                      <span className="text-xs text-muted-foreground">
                        {q.category.name}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      by {q.createdBy?.name} &middot; {formatDate(q.createdAt)}
                    </span>
                  </div>
                  <Link
                    to={`/questions/${q.id}`}
                    className="block font-semibold hover:underline"
                  >
                    {q.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{q.prompt}</p>
                  <div className="space-y-3">
                    {q.answers.map((a) => (
                      <AnswerView key={a.id} answer={a} />
                    ))}
                  </div>
                  {status === "PENDING" && (
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRejectTarget({ id: q.id, kind: "questions" })
                        }
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => approve(q.id)}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <Pagination
              page={questionQueue.data.page}
              totalPages={questionQueue.data.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : (
          <EmptyState label="questions" />
        )
      ) : answerQueue.data && answerQueue.data.items.length > 0 ? (
        <div className="space-y-4">
          {answerQueue.data.items.map((a) => (
            <Card key={a.id}>
              <CardContent className="space-y-3 p-5">
                <Link
                  to={`/questions/${a.question.id}`}
                  className="block text-sm font-semibold hover:underline"
                >
                  On: {a.question.title}
                </Link>
                <AnswerView answer={a} />
                {status === "PENDING" && (
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setRejectTarget({ id: a.id, kind: "answers" })
                      }
                    >
                      <X className="h-4 w-4" /> Reject
                    </Button>
                    <Button size="sm" onClick={() => approve(a.id)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <Pagination
            page={answerQueue.data.page}
            totalPages={answerQueue.data.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <EmptyState label="answers" />
      )}

      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject submission</DialogTitle>
            <DialogDescription>
              Let the contributor know why this was rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="reject-note">Reason (optional)</Label>
            <Textarea
              id="reject-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
      No {label} in this queue.
    </div>
  );
}
