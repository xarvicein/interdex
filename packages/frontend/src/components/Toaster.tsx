import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/utils";

const icons = {
  default: Info,
  success: CheckCircle2,
  destructive: AlertCircle,
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.variant ?? "default"];
        return (
          <div
            key={t.id}
            className={cn(
              "animate-fade-in flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg",
              t.variant === "success" && "border-success/30",
              t.variant === "destructive" && "border-destructive/30",
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                t.variant === "success" && "text-success",
                t.variant === "destructive" && "text-destructive",
                (!t.variant || t.variant === "default") && "text-primary",
              )}
            />
            <div className="flex-1 text-sm">
              <p className="font-medium text-foreground">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-muted-foreground">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
