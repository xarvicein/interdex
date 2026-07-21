import Editor from "@monaco-editor/react";
import { useUiStore } from "@/store/uiStore";

interface CodeBlockProps {
  code: string;
  language?: string | null;
  minHeight?: number;
  maxHeight?: number;
}

export function CodeBlock({
  code,
  language,
  minHeight = 100,
  maxHeight = 480,
}: CodeBlockProps) {
  const theme = useUiStore((s) => s.theme);
  const lineCount = code.split("\n").length;
  const height = Math.min(Math.max(lineCount * 19 + 24, minHeight), maxHeight);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Editor
        height={height}
        language={mapLanguage(language)}
        value={code}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: "on",
          folding: false,
          renderLineHighlight: "none",
          overviewRulerLanes: 0,
          scrollbar: { alwaysConsumeMouseWheel: false },
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
}

function mapLanguage(language?: string | null): string {
  const normalized = (language || "").toLowerCase();
  const known = [
    "python",
    "sql",
    "typescript",
    "javascript",
    "tsx",
    "jsx",
    "json",
    "html",
    "css",
    "bash",
    "go",
    "java",
    "rust",
  ];
  if (known.includes(normalized)) return normalized;
  if (normalized === "js") return "javascript";
  if (normalized === "ts") return "typescript";
  if (normalized === "py") return "python";
  return "plaintext";
}
