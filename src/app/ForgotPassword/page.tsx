"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "./useAuthStore";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [countdown, setCountdown] = useState(0);
  const { setEmail, setToken } = useAuthStore();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    if (countdown > 0) {
      toast.warning(`Please wait ${countdown}s before resending.`, {
        id: "upload",
      });
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgotpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        }
      );

      const result = await res.json();
      console.log(result);

      if (res.ok) {
        toast.success("Reset link sent to your email");
        const expiry = Date.now() + 60 * 1000;
        setEmail(data.email);
        setToken(result?.data?.token);
        localStorage.setItem("resetCountdown", expiry.toString());
        router.push("/OTP");
      } else {
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    }
  };

  useEffect(() => {
    const storedExpiry = localStorage.getItem("resetCountdown");
    if (storedExpiry) {
      const timeLeft = Math.floor((+storedExpiry - Date.now()) / 1000);
      if (timeLeft > 0) {
        setCountdown(timeLeft);
      } else {
        localStorage.removeItem("resetCountdown");
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      localStorage.removeItem("resetCountdown");
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <section className="flex h-[calc(100vh-100px)] border-orange-500 bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <h1 className="mb-1 mt-4 text-xl font-semibold text-orange-500">
            Recover Password
          </h1>
          <p className="text-sm ">Enter your email to receive a reset link</p>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm text-orange-500">
                Email
              </Label>
              <Input
                {...register("email")}
                type="email"
                name="email"
                id="email"
                placeholder="name@example.com"
                className="border border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || countdown > 0}
              className={`w-full bg-orange-500  text-white p-2 border rounded-xl
    ${
      isSubmitting || countdown > 0
        ? "cursor-not-allowed opacity-60"
        : "cursor-pointer hover:bg-orange-400 "
    }`}
            >
              {isSubmitting
                ? "Sending..."
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Send Reset Link"}
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              We'll send you a link to reset your password.
            </p>
          </div>
        </div>
        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Remembered your password?
            <Button asChild variant="link" className="px-2 text-orange-500">
              <Link href="/Login">Log in</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
