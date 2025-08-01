"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GithubIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { setIsLoggedIn } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", result.data.token);
      setIsLoggedIn(true);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] px-4">
      <Card className="w-full border-orange-400 md:w-[350px]">
        <CardHeader>
          <CardTitle className="text-orange-500">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-2 gap-4 text-orange-500">
            <Button
              variant="outline"
              className="w-full hover:bg-orange-100 hover:text-orange-500 cursor-pointer"
            >
              <MailIcon />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-orange-100 hover:text-orange-500 cursor-pointer"
            >
              <GithubIcon />
              GitHub
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-orange-500">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                className="border border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-orange-500">
                  Password
                </Label>
                <Link
                  href="/ForgotPassword"
                  className="text-orange-500 text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
                className="border border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-orange-500  text-white p-2 border rounded-xl
    ${
      isSubmitting
        ? "cursor-not-allowed opacity-60"
        : "cursor-pointer hover:bg-orange-400 "
    }`}
            >
              {isSubmitting ? "Logging in..." : "Login with Email"}
            </button>
          </form>
          <span className="text-sm text-gray-400">
            Not a member?{" "}
            <Link
              href="/Register"
              className="ml-1 hover:underline text-orange-500"
            >
              Sign up
            </Link>
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
