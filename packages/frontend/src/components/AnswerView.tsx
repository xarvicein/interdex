import ReactMarkdown from "react-markdown";
import type { AnswerDTO } from "@interdex/shared";
import { CodeBlock } from "@/components/CodeBlock";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export function AnswerView({
  answer,
  showStatus = false,
}: {
  answer: AnswerDTO;
  showStatus?: boolean;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Answered by{" "}
          <span className="font-medium text-foreground">
            {answer.createdBy?.name ?? "Unknown"}
          </span>{" "}
          &middot; {formatDate(answer.createdAt)}
        </span>
        {showStatus && <StatusBadge status={answer.status} />}
      </div>

      {(answer.contentType === "TEXT" || answer.contentType === "BOTH") &&
        answer.textContent && (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-transparent prose-pre:p-0">
            <ReactMarkdown>{answer.textContent}</ReactMarkdown>
          </div>
        )}

      {(answer.contentType === "CODE" || answer.contentType === "BOTH") &&
        answer.codeContent && (
          <CodeBlock code={answer.codeContent} language={answer.codeLanguage} />
        )}
    </div>
  );
}
