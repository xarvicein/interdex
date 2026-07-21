import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
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
import { useGoogleSsoStatus, useRegister } from "@/api/auth";
import { API_URL, getApiErrorMessage } from "@/api/client";
import { toast } from "@/store/toastStore";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const registerUser = useRegister();
  const navigate = useNavigate();
  const { data: googleEnabled } = useGoogleSsoStatus();

  async function onSubmit(values: FormValues) {
    try {
      await registerUser.mutateAsync(values);
      navigate("/", { replace: true });
    } catch (err) {
      toast({
        title: "Registration failed",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join InterDex to submit and track interview questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={registerUser.isPending}
            >
              {registerUser.isPending
                ? "Creating account..."
                : "Create account"}
            </Button>
          </form>

          {googleEnabled && (
            <>
              <div className="relative py-1 text-center text-xs text-muted-foreground">
                <span className="relative bg-card px-2">or</span>
                <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href={`${API_URL}/auth/google`}>Continue with Google</a>
              </Button>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
