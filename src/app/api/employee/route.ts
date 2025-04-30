import { auth } from "@/auth";
import { db } from "@/db";
import { authorizedUsers, employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async function (req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  try {
    const employee = await db.select().from(employees).execute();

    return NextResponse.json({ employees: employee }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function (req) {
  const session=req.auth;
  console.log("session",session);
  if (!req.auth) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, email, phone, status, employeeType } = body;

    if (!name || !email || !phone || !status || !employeeType) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const authorisedUserId = await db.select({ id: authorizedUsers.id })
      .from(authorizedUsers)
      .where(eq(authorizedUsers.email, session!.user?.email ?? ''))
      .execute();
    await db
      .insert(employees)
      .values({
        name,
        email,
        phone,
        status,
        employeeType,
        createdById:authorisedUserId[0].id
      })
      .execute();
    return NextResponse.json({ message: "Employee created" }, { status: 201 });  
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});

