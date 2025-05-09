import { auth } from "@/auth";
import { db } from "@/db";
import { assets, assetService } from "@/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }
  try {
    const { serviceReason, sentOn, image } = await req.json();
    const { id } = await params;
    const existingService = await db
      .select()
      .from(assetService)
      .where(and(eq(assetService.assetId, id), isNull(assetService.receivedOn)))
      .orderBy(sentOn);
    if (existingService.length > 0) {
      return NextResponse.json(
        { message: "Already Sent to Service" },
        { status: 409 }
      );
    }
    await db.insert(assetService).values({
      serviceReason,
      sentOn: new Date(sentOn),
      image,
      createdAt: sql`now()`,
      assetId: id,
      sentBy: session.user?.id,
    });
    await db.update(assets).set({ status: "service" }).where(eq(assets.id, id));

    return NextResponse.json(
      { message: "Sent to Service Successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
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
    const { id } = params;
    const { remark, servicePrice, receivedOn, image } = await req.json();

    const existingService = await db
      .select()
      .from(assetService)
      .where(
        and(eq(assetService.assetId, id), isNull(assetService.receivedOn))
      );

    if (existingService.length > 0) {
      const serviceId = existingService[0].id;

      await db.transaction(async (tx) => {
        await tx
          .update(assetService)
          .set({
            remark,
            servicePrice,
            receivedOn: new Date(receivedOn),
            image,
            updatedAt: sql`now()`,
          })
          .where(eq(assetService.id, serviceId));
        await tx
          .update(assets)
          .set({ status: "available" })
          .where(eq(assets.id, id));
      });

      return NextResponse.json(
        { message: "Service marked as completed" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No pending service found for this asset" },
        { status: 404 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
