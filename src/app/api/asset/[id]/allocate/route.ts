import { auth } from "@/auth";
import { db } from "@/db";
import { assetAssignment } from "@/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const alreadyAssigned = await db
      .select()
      .from(assetAssignment)
      .where(
        and(eq(assetAssignment.assetId, id), isNull(assetAssignment.returnedOn))
      );
    if (alreadyAssigned.length > 0) {
      return NextResponse.json(
        { message: "Asset is already allocated" },
        { status: 409 }
      );
    }
    const { employeeId, assignedDate } = await req.json();
    await db.insert(assetAssignment).values({
      assetId: id,
      employeeId,
      assignedOn: assignedDate,
      assignedById: session.user?.id,
    });
    return NextResponse.json({ message: "Asset Allocated Successfully" });
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
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { returnOn, returnReason } = await req.json();
    const { id } = await params;
    if (!returnOn || !returnReason) {
      return NextResponse.json({ message: "Required Fields" }, { status: 400 });
    }

    await db
      .update(assetAssignment)
      .set({
        returnedOn: returnOn,
        returnReason,
        updatedAt: sql`now()`,
      })
      .where(eq(assetAssignment.assetId, id));
    return NextResponse.json(
      { message: "Retrieved Successfully" },
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
