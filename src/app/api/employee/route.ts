import { auth } from "@/auth";
import { db } from "@/db";
import { assetAssignment, employees } from "@/db/schema";
import { and, count, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async function (req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });

  // console.log(req.auth);
  try {
    const allEmployees = await db
      .select()
      .from(employees)
      .where(isNull(employees.deletedAt));

    const assetCounts = await db
      .select({
        employeeId: employees.id,
        count: count(assetAssignment.id).as("count"),
      })
      .from(employees)
      .leftJoin(assetAssignment, eq(employees.id, assetAssignment.employeeId))
      .where(isNull(assetAssignment.returnedOn))
      .groupBy(employees.id);

    const assetMap = new Map(
      assetCounts.map((row) => [row.employeeId, row.count])
    );

    const enrichedEmployees = allEmployees.map((emp) => ({
      ...emp,
      assetCount: assetMap.get(emp.id) ?? 0,
    }));

    return NextResponse.json({ employees: enrichedEmployees }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function (req) {
  const session = req.auth;
  console.log("session", session);
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

    const existingUser = await db
      .select()
      .from(employees)
      .where(and(eq(employees.email, email), isNull(employees.deletedAt)))
      .execute();

    if (existingUser.length>0) {
      return NextResponse.json(
        { message: "Employee with this email id already exists" },
        { status: 409 }
      );
    }
    await db
      .insert(employees)
      .values({
        name,
        email,
        phone,
        status,
        employeeType,
        createdById: session!.user?.id,
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
