"use client";

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

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
            variant="outlined"
            onClick={handleSignIn}
            fullWidth
            startIcon={<FcGoogle size={25} />}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
