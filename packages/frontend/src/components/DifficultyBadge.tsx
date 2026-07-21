import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@interdex/shared";

const styles: Record<Difficulty, "success" | "warning" | "destructive"> = {
  EASY: "success",
  MEDIUM: "warning",
  HARD: "destructive",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant={styles[difficulty]} className="capitalize">
      {difficulty.toLowerCase()}
    </Badge>
  );
}
