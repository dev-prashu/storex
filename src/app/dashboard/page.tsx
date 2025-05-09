import { auth } from "@/auth";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";
import React from "react";

async function DashBoard() {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect("/login");
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button type="submit" variant="outlined">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Welcome to your dashboard
        </h2>
        <p>You are logged in as: {session.user?.email}</p>
      </div>
    </div>
  );
}

export default DashBoard;
