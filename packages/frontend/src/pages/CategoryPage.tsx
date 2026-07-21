import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import type { Difficulty } from "@interdex/shared";
import { useCategories } from "@/api/categories";
import { useQuestions } from "@/api/questions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionCard } from "@/components/QuestionCard";
import { Pagination } from "@/components/Pagination";
import { PageSpinner } from "@/components/Spinner";

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

export function CategoryPage() {
  const { slug = "all" } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { data: categories } = useCategories();

  const search = params.get("search") ?? "";
  const difficulty =
    (params.get("difficulty") as Difficulty | null) ?? undefined;
  const page = Number(params.get("page") ?? "1");

  const activeCategory = useMemo(
    () => categories?.find((c) => c.slug === slug),
    [categories, slug],
  );

  const { data, isLoading, isPlaceholderData } = useQuestions({
    category: slug === "all" ? undefined : slug,
    difficulty,
    search: search || undefined,
    page,
    pageSize: 12,
  });

  function updateParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {slug === "all"
            ? "All questions"
            : (activeCategory?.name ?? "Loading...")}
        </h1>
        {activeCategory?.description && (
          <p className="text-muted-foreground">{activeCategory.description}</p>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={search}
            placeholder="Search questions..."
            className="pl-9"
            onChange={(e) => updateParam("search", e.target.value || undefined)}
          />
        </div>

        <Select
          value={slug}
          onValueChange={(v) =>
            navigate(`/categories/${v}${window.location.search}`)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={difficulty ?? "any"}
          onValueChange={(v) =>
            updateParam("difficulty", v === "any" ? undefined : v)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any difficulty</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d} className="capitalize">
                {d.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data && data.items.length > 0 ? (
        <div
          className={
            isPlaceholderData ? "opacity-60 transition-opacity" : undefined
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(p) => updateParam("page", String(p))}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
          No questions found. Try a different search or filter.
        </div>
      )}
    </div>
  );
}
