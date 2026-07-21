import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Code2,
  Database,
  FileCode2,
  Layers,
  Braces,
  Network,
} from "lucide-react";
import { useCategories } from "@/api/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/Spinner";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  python: Code2,
  sql: Database,
  typescript: FileCode2,
  javascript: Braces,
  react: Layers,
  "system-design": Network,
};

export function HomePage() {
  const { data: categories, isLoading } = useCategories();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/categories/all?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <div>
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Community-reviewed interview questions
          </span>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Ace your next technical interview
          </h1>
          <p className="max-w-xl text-balance text-muted-foreground">
            Browse curated Python, SQL, TypeScript, JavaScript, React, and
            System Design questions — or submit your own for review and help
            others prepare.
          </p>
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-lg items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search questions, e.g. "closures", "window functions"...'
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </section>

      <section className="container py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Browse by category
            </h2>
            <p className="text-sm text-muted-foreground">
              Every category is managed from the database — nothing here is
              hardcoded.
            </p>
          </div>
        </div>

        {isLoading ? (
          <PageSpinner />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category) => {
              const Icon = ICONS[category.slug] ?? Code2;
              return (
                <Link key={category.id} to={`/categories/${category.slug}`}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader className="flex-row items-center gap-3 space-y-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <CardTitle className="text-base">
                          {category.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {category.questionCount ?? 0} questions
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
