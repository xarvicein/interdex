import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfile } from "@/api/users";
import { toast } from "@/store/toastStore";
import { getApiErrorMessage } from "@/api/client";
import { formatDate } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});
type FormValues = z.infer<typeof schema>;

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updateProfile.mutateAsync(values);
      toast({ title: "Profile updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  if (!user) return null;

  return (
    <div className="container max-w-lg py-10">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account details</CardTitle>
          <CardDescription>
            {user.email} &middot; Member since {formatDate(user.createdAt)}
          </CardDescription>
          <div className="flex gap-2 pt-1">
            <Badge variant="secondary">{user.role}</Badge>
            <Badge variant="outline">
              {user.authProvider === "GOOGLE"
                ? "Google account"
                : "Email & password"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={!isDirty || updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
