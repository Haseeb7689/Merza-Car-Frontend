"use client";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/ForgotPassword/useAuthStore";
import { useRef } from "react";

export default function OTPForm() {
  const router = useRouter();
  const didVerify = useRef(false);
  const { email, token, setResetToken, setToken } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOTPComplete = async (otpValue: string) => {
    try {
      setIsVerifying(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/validOTP`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, otp: otpValue, purpose: "reset" }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("OTP verified successfully!");
        setResetToken(result?.data?.resettoken || "");
        setToken("");
        router.push(`/ResetPassword`);
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Network error, please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!token) {
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
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Link invalid or expired.");
          setToken("");
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

    if (!email) {
      toast.error("Email not found, please start again.");
      router.push("/ForgotPassword");
      return;
    }
  }, [router]);

  if (loading) {
    return <div className="text-center p-10 text-lg">Checking access...</div>;
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] px-4">
      <Card className="w-full md:w-[350px] border-orange-500">
        <CardHeader>
          <CardTitle className="text-orange-500">
            Enter Verification Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            onComplete={handleOTPComplete}
            disabled={isVerifying}
          >
            <InputOTPGroup className="space-x-4 [&>*]:rounded-md [&>*]:border-2 [&>*]:border-orange-500 [&>*]:focus:outline-orange-400 [&>*]:focus:ring-2 [&>*]:focus:border-orange-600">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-muted-foreground text-sm">
            {isVerifying
              ? "Verifying..."
              : "You will be automatically redirected after the code is confirmed."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
