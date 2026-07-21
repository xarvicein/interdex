import { Badge } from "@/components/ui/badge";
import type { ReviewStatus } from "@interdex/shared";

const styles: Record<ReviewStatus, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

export function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <Badge variant={styles[status]} className="capitalize">
      {status.toLowerCase()}
    </Badge>
  );
}
