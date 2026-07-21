import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Difficulty } from "@interdex/shared";
import { useCategories } from "@/api/categories";
import { useCreateQuestion } from "@/api/questions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnswerComposer,
  type AnswerComposerValue,
} from "@/components/AnswerComposer";
import { toast } from "@/store/toastStore";
import { getApiErrorMessage } from "@/api/client";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  prompt: z.string().min(10, "Give a bit more detail").max(10000),
  categoryId: z.string().min(1, "Choose a category"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tagsInput: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function SubmitQuestionPage() {
  const { data: categories } = useCategories();
  const createQuestion = useCreateQuestion();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<AnswerComposerValue | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { difficulty: "MEDIUM" as Difficulty },
  });

  async function onSubmit(values: FormValues) {
    if (!answer) {
      toast({
        title: "Add an answer before submitting",
        variant: "destructive",
      });
      return;
    }
    const tags = (values.tagsInput || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);

    try {
      await createQuestion.mutateAsync({
        title: values.title,
        prompt: values.prompt,
        categoryId: values.categoryId,
        difficulty: values.difficulty,
        tags,
        answers: [answer],
      });
      toast({
        title: "Submitted for review",
        description: "An admin will approve or reject it soon.",
        variant: "success",
      });
      navigate("/my-submissions");
    } catch (err) {
      toast({
        title: "Submission failed",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Submit a question</h1>
        <p className="text-muted-foreground">
          Your question and answer will be sent for admin review before
          appearing publicly.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question details</CardTitle>
            <CardDescription>
              Be specific — this is how it'll appear to other candidates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. What is a Python decorator?"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prompt">Full question</Label>
              <Textarea
                id="prompt"
                rows={4}
                placeholder="Describe exactly what should be asked..."
                {...register("prompt")}
              />
              {errors.prompt && (
                <p className="text-xs text-destructive">
                  {errors.prompt.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-xs text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Controller
                  control={control}
                  name="difficulty"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="closures, scope, hoisting"
                {...register("tagsInput")}
              />
            </div>
          </CardContent>
        </Card>

        <div>
          <Label className="mb-2 block">Answer</Label>
          <AnswerComposer
            onSubmit={(value) => setAnswer(value)}
            isSubmitting={false}
            submitLabel="Save answer"
          />
          {answer && (
            <p className="mt-2 text-xs text-success">
              Answer ready — you can still edit it above before submitting.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={createQuestion.isPending}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          >
            {createQuestion.isPending ? "Submitting..." : "Submit for review"}
          </button>
        </div>
      </form>
    </div>
  );
}
