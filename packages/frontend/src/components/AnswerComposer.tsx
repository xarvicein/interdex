import { useState } from "react";
import Editor from "@monaco-editor/react";
import type { AnswerContentType } from "@interdex/shared";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useUiStore } from "@/store/uiStore";

const LANGUAGES = [
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

export interface AnswerComposerValue {
  contentType: AnswerContentType;
  textContent?: string;
  codeContent?: string;
  codeLanguage?: string;
}

interface AnswerComposerProps {
  onSubmit: (value: AnswerComposerValue) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initial?: Partial<AnswerComposerValue>;
  submitLabel?: string;
}

export function AnswerComposer({
  onSubmit,
  onCancel,
  isSubmitting,
  initial,
  submitLabel = "Submit answer",
}: AnswerComposerProps) {
  const [mode, setMode] = useState<AnswerContentType>(
    initial?.contentType ?? "TEXT",
  );
  const [textContent, setTextContent] = useState(initial?.textContent ?? "");
  const [codeContent, setCodeContent] = useState(
    initial?.codeContent ?? "// Your code here\n",
  );
  const [codeLanguage, setCodeLanguage] = useState(
    initial?.codeLanguage ?? "python",
  );
  const theme = useUiStore((s) => s.theme);

  const isValid =
    (mode === "TEXT" && textContent.trim().length > 0) ||
    (mode === "CODE" && codeContent.trim().length > 0) ||
    (mode === "BOTH" &&
      textContent.trim().length > 0 &&
      codeContent.trim().length > 0);

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({
      contentType: mode,
      textContent: mode !== "CODE" ? textContent : undefined,
      codeContent: mode !== "TEXT" ? codeContent : undefined,
      codeLanguage: mode !== "TEXT" ? codeLanguage : undefined,
    });
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <Label>Answer format</Label>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as AnswerContentType)}
          >
            <TabsList>
              <TabsTrigger value="TEXT">Text</TabsTrigger>
              <TabsTrigger value="CODE">Code</TabsTrigger>
              <TabsTrigger value="BOTH">Both</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {(mode === "TEXT" || mode === "BOTH") && (
          <div className="space-y-1.5">
            <Label htmlFor="answer-text">
              Explanation (markdown supported)
            </Label>
            <Textarea
              id="answer-text"
              rows={6}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Explain the concept clearly and thoroughly..."
            />
          </div>
        )}

        {(mode === "CODE" || mode === "BOTH") && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Code</Label>
              <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <Editor
                height={260}
                language={codeLanguage}
                value={codeContent}
                theme={theme === "dark" ? "vs-dark" : "light"}
                onChange={(value) => setCodeContent(value ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
