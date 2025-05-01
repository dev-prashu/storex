import { auth } from "@/auth";
import { db } from "@/db";
import { assetAssignment, employees } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .execute();

    return NextResponse.json({ employee: employee }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, status, employeeType } = body;

    if (!name || !email || !phone || !status || !employeeType) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingId = await db
      .select({ id: employees.id })
      .from(employees)
      .where(eq(employees.email, email))
      .execute();

    if (existingId.length > 0 && id != existingId[0].id) {
      return NextResponse.json(
        { message: "Employee Email Id Already exists" },
        { status: 400 }
      );
    }
    await db
      .update(employees)
      .set({ name, email, phone, status, employeeType, updatedAt: sql`now()` })
      .where(eq(employees.id, id))
      .execute();
    return NextResponse.json(
      { message: "Employee Updated Successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const assetAssigned = await db
      .select()
      .from(assetAssignment)
      .where(eq(assetAssignment.employeeId, id))
      .execute();
    if (assetAssigned.length > 0) {
      return NextResponse.json(
        { message: "An asset is assigned to employee" },
        { status: 400 }
      );
    }
    await db
      .update(employees)
      .set({ deletedAt: sql`now()`, deletedById: session.user?.id })
      .where(eq(employees.id, id))
      .execute();

    return NextResponse.json(
      { message: "Employee Deleted Successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
}
