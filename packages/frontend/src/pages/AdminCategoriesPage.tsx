import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { CategoryDTO } from "@interdex/shared";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
  type CategoryInput,
} from "@/api/categories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageSpinner } from "@/components/Spinner";
import { toast } from "@/store/toastStore";
import { getApiErrorMessage } from "@/api/client";

export function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editing, setEditing] = useState<CategoryDTO | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<CategoryInput>();

  useEffect(() => {
    reset(
      editing
        ? {
            name: editing.name,
            slug: editing.slug,
            description: editing.description ?? "",
            icon: editing.icon ?? "",
          }
        : { name: "", slug: "", description: "", icon: "" },
    );
  }, [editing, reset, dialogOpen]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(category: CategoryDTO) {
    setEditing(category);
    setDialogOpen(true);
  }

  async function onSubmit(values: CategoryInput) {
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, ...values });
        toast({ title: "Category updated", variant: "success" });
      } else {
        await createCategory.mutateAsync(values);
        toast({ title: "Category created", variant: "success" });
      }
      setDialogOpen(false);
    } catch (err) {
      toast({
        title: "Save failed",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  async function handleDelete(category: CategoryDTO) {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    try {
      await deleteCategory.mutateAsync(category.id);
      toast({ title: "Category deleted", variant: "success" });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Every category on the site is managed here.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New category
        </Button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="space-y-3">
          {categories?.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">
                    {category.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      /{category.slug}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.questionCount ?? 0} approved questions
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(category)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit category" : "New category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" {...register("name", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-slug">
                Slug (optional — derived from name if left blank)
              </Label>
              <Input id="cat-slug" {...register("slug")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea id="cat-desc" rows={3} {...register("description")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-icon">Icon key</Label>
              <Input
                id="cat-icon"
                placeholder="python, sql, react..."
                {...register("icon")}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {editing ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
