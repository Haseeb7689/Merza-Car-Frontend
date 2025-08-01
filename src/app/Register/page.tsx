"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name field is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", result?.data?.token);

      toast.success("Account created successfully!");
      router.push("/Login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] px-4">
      <Card className="w-full md:w-[350px] border-orange-400">
        <CardHeader>
          <CardTitle className="text-xl text-orange-500">
            Create a new account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-orange-500">
                Name
              </Label>
              <Input
                id="name"
                type="name"
                placeholder="Enter your name"
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
                className="border border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className=" text-orange-500">
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
              <Label htmlFor="password" className=" text-orange-500">
                Password
              </Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className=" text-orange-500">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Enter your password"
                {...register("confirmPassword")}
                aria-invalid={errors.password ? "true" : "false"}
                className="border border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-orange-500   text-white p-2 border rounded-xl
    ${
      isSubmitting
        ? "cursor-not-allowed opacity-60"
        : "cursor-pointer hover:bg-orange-400"
    }`}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
          <span className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/Login"
              className="ml-1 hover:underline text-orange-500"
            >
              Log in
            </Link>
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
