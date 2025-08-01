"use client";

import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/ForgotPassword/useAuthStore";
import { useRef } from "react";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SimpleReset() {
  const router = useRouter();
  const { email, resetToken, setResetToken, setEmail } = useAuthStore();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const didVerify = useRef(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: PasswordFormValues) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resetpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resetToken}`,
          },
          body: JSON.stringify({
            email,
            newPassword: data.password,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setEmail("");
        localStorage.removeItem("resetCountdown");
        setResetToken("");
        setIsSubmitted(true);
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
    }
  }

  useEffect(() => {
    if (!resetToken) {
      router.replace("/404Page");
      return;
    }
    if (didVerify.current) return;
    didVerify.current = true;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verifytoken`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resetToken}`,
            },
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data.message || "Link invalid or expired.");
          setResetToken("");
          setEmail("");
          router.replace("/ForgotPassword");
          return;
        }
        setLoading(false);
      } catch {
        toast.error("Network error.");
        router.replace("/ForgotPassword");
        return;
      }
    })();
  }, [router]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };
  if (loading) {
    return <div className="text-center p-10 text-lg">Checking access...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-1">
          <div className="bg-orange-100 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <LockIcon className="text-orange-500 h-6 w-6" />
          </div>
          <CardTitle className="text-center text-2xl text-orange-500">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
              <AlertDescription>
                Your password has been successfully reset. You can now{" "}
                <Link href="/Login" className="font-medium underline">
                  Log in
                </Link>{" "}
                with your new credentials.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-500">
                        New Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            className="border border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                            type={isPasswordVisible ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground absolute top-0 right-0 h-full px-3 py-2"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            Toggle password visibility
                          </span>
                        </Button>
                      </div>
                      <FormDescription>
                        Password must be at least 8 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-500">
                        Confirm Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            className="border border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                            type={
                              isConfirmPasswordVisible ? "text" : "password"
                            }
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground absolute top-0 right-0 h-full px-3 py-2"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            Toggle confirm password visibility
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
