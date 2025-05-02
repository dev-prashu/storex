import { auth } from "@/auth";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db
      .update(employees)
      .set({
        status: "active",
        deletedAt: null,
        deletedById: null,
      })
      .where(eq(employees.id, id))
      .execute();

    return NextResponse.json(
      { message: "Employee Restored Successfully" },
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
