"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-2/5 relative bg-muted">
        <Image
          src="/login-cover.svg"
          alt="Login Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-3/5 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Storex</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSignIn}
          >
            <FcGoogle className="text-lg" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
