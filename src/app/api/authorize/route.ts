import { auth } from "@/auth";
import { db } from "@/db";
import { authorizedUsers } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const users = await db
      .select()
      .from(authorizedUsers)
      .where(isNull(authorizedUsers.deletedAt));

    return NextResponse.json({ authorizedUsers: users }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function (req) {
  const session = req.auth;
  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  try {
    const { email } = await req.json();
    const existingUser = await db
      .select()
      .from(authorizedUsers)
      .where(
        and(eq(authorizedUsers.email, email), isNull(authorizedUsers.deletedAt))
      );
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }
    await db
      .insert(authorizedUsers)
      .values({ email, addedById: session!.user?.id })
      .execute();
    return NextResponse.json(
      { message: "User Added Successfully" },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});
