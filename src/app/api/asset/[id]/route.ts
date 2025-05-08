import { auth } from "@/auth";
import { db } from "@/db";
import {
  accessoriesSpecs,
  assetAssignment,
  assets,
  hardDiskSpecs,
  laptopSpecs,
  mobileSpecs,
  monitorSpecs,
  pendriveSpecs,
  ramSpecs,
  simSpecs,
} from "@/db/schema";
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
    const asset = await db
      .select({
        id: assets.id,
        model: assets.model,
        brand: assets.brand,
        serial: assets.serial,
        purchaseDate: assets.purchaseDate,
        type: assets.type,
        ownedBy: assets.ownedBy,
        createdAt: assets.createdAt,
      })
      .from(assets)
      .where(eq(assets.id, id));
    if (!asset[0]) {
      throw new Error("Asset not found");
    }
    const data = asset[0];
    const assignment = await db
      .select({ assignedOn: assetAssignment.assignedOn })
      .from(assetAssignment)
      .where(eq(assetAssignment.id, data.id));

    const assignedDate = assignment[0]?.assignedOn ?? null;

    return NextResponse.json({
      ...data,
      assignedDate: assignedDate,
    });
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
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id } = await params;
    const {
      model,
      brand,
      serial,
      purchaseDate,
      expiryDate,
      isAvailable,
      ownedBy,
      clientName,
      type,
      assetPic,
      series,
      processor,
      ram,
      operatingSystem,
      screenResolution,
      storage,
      charger,
      imei1,
      imei2,
      imei3,
      simNo,
      phoneNo,
      capacity,
      remark,
      diskType,
      accessoryType,
    } = body;

    // First get the current type to handle type changes
    const [currentAsset] = await db
      .select({ type: assets.type })
      .from(assets)
      .where(eq(assets.id, id));

    if (!currentAsset) {
      return NextResponse.json({ message: "Asset not found" }, { status: 404 });
    }

    if (currentAsset.type !== type) {
      await Promise.all([
        db.delete(laptopSpecs).where(eq(laptopSpecs.assetId, id)),
        db.delete(monitorSpecs).where(eq(monitorSpecs.assetId, id)),
        db.delete(pendriveSpecs).where(eq(pendriveSpecs.assetId, id)),
        db.delete(hardDiskSpecs).where(eq(hardDiskSpecs.assetId, id)),
        db.delete(mobileSpecs).where(eq(mobileSpecs.assetId, id)),
        db.delete(simSpecs).where(eq(simSpecs.assetId, id)),
        db.delete(accessoriesSpecs).where(eq(accessoriesSpecs.assetId, id)),
        db.delete(ramSpecs).where(eq(ramSpecs.assetId, id)),
      ]);
    }
    switch (type) {
      case "laptop": {
        if (
          !series ||
          !processor ||
          !ram ||
          !operatingSystem ||
          !screenResolution ||
          !storage ||
          !charger
        ) {
          return NextResponse.json(
            { message: "All laptop fields are required" },
            { status: 400 }
          );
        }
        await db
          .insert(laptopSpecs)
          .values({
            series,
            processor,
            ram,
            os: operatingSystem,
            screenRes: screenResolution,
            storage: storage,
            charger: charger,
            assetId: id,
          })
          .onConflictDoUpdate({
            target: laptopSpecs.assetId,
            set: {
              series,
              processor,
              ram,
              os: operatingSystem,
              screenRes: screenResolution,
              storage,
              charger,
            },
          });
        break;
      }
      case "monitor": {
        if (!screenResolution) {
          return NextResponse.json(
            { message: "Screen Resolution Field is required" },
            { status: 400 }
          );
        }
        await db
          .insert(monitorSpecs)
          .values({
            assetId: id,
            screenRes: screenResolution,
          })
          .onConflictDoUpdate({
            target: monitorSpecs.assetId,
            set: {
              screenRes: screenResolution,
            },
          });
        break;
      }
      case "pendrive": {
        if (!storage) {
          return NextResponse.json(
            { message: "Storage Field is required" },
            { status: 400 }
          );
        }
        await db
          .insert(pendriveSpecs)
          .values({ assetId: id, storage })
          .onConflictDoUpdate({
            target: pendriveSpecs.assetId,
            set: { storage },
          });
        break;
      }
      case "hardisk": {
        if (!storage) {
          return NextResponse.json(
            { message: "Storage Field is missing" },
            { status: 400 }
          );
        }
        await db
          .insert(hardDiskSpecs)
          .values({ assetId: id, storage, type: diskType })
          .onConflictDoUpdate({
            target: hardDiskSpecs.assetId,
            set: { storage, type: diskType },
          });
        break;
      }
      case "mobile": {
        if (!imei1 || !imei2 || !imei3) {
          return NextResponse.json(
            { message: "IMEI is missing" },
            { status: 400 }
          );
        }
        await db
          .insert(mobileSpecs)
          .values({
            imei1,
            imei2,
            imei3,
            assetId: id,
          })
          .onConflictDoUpdate({
            target: mobileSpecs.assetId,
            set: {
              imei1,
              imei2,
              imei3,
            },
          });
        break;
      }
      case "sim": {
        if (!simNo || !phoneNo) {
          return NextResponse.json(
            { message: "SIM Fields are missing" },
            { status: 400 }
          );
        }
        await db
          .insert(simSpecs)
          .values({
            simno: simNo,
            phone: phoneNo,
            assetId: id,
          })
          .onConflictDoUpdate({
            target: simSpecs.assetId,
            set: {
              simno: simNo,
              phone: phoneNo,
            },
          });
        break;
      }
      case "mouse": {
        await db
          .insert(accessoriesSpecs)
          .values({
            type: "mouse",
            assetId: id,
          })
          .onConflictDoUpdate({
            target: accessoriesSpecs.assetId,
            set: {
              type: "mouse",
            },
          });
        break;
      }
      case "accessories": {
        if (!accessoryType) {
          return NextResponse.json(
            { message: "Accessory type is required" },
            { status: 400 }
          );
        }
        switch (accessoryType) {
          case "ram": {
            if (!capacity) {
              return NextResponse.json(
                { message: "Capacity is missing" },
                { status: 400 }
              );
            }
            await db
              .insert(ramSpecs)
              .values({
                capacity,
                assetId: id,
                remark,
              })
              .onConflictDoUpdate({
                target: ramSpecs.assetId,
                set: {
                  capacity,
                  remark,
                },
              });
            break;
          }
          case "cable":
          case "keyboard": {
            await db
              .insert(accessoriesSpecs)
              .values({
                type: accessoryType,
                remark,
                assetId: id,
              })
              .onConflictDoUpdate({
                target: accessoriesSpecs.assetId,
                set: {
                  type: accessoryType,
                  remark,
                },
              });
            break;
          }
          case "other": {
            if (!remark) {
              return NextResponse.json(
                { message: "Remark is required for type 'other'" },
                { status: 400 }
              );
            }
            await db
              .insert(accessoriesSpecs)
              .values({
                type: "other",
                remark,
                assetId: id,
              })
              .onConflictDoUpdate({
                target: accessoriesSpecs.assetId,
                set: {
                  type: "other",
                  remark,
                },
              });
            break;
          }
        }
        break;
      }
    }
    await db
      .update(assets)
      .set({
        brand,
        model,
        serial,
        purchaseDate,
        warrantyStartDate: purchaseDate,
        warrantyExpiryDate: expiryDate,
        type,
        assetPic,
        isAvailable,
        ownedBy,
        clientName: ownedBy === "client" ? clientName : null,
      })
      .where(eq(assets.id, id))
      .returning({ assetId: assets.id });
    return NextResponse.json(
      { message: "Asset Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
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
    const assetAllocated = await db
      .select()
      .from(assetAssignment)
      .where(eq(assetAssignment.assetId, id));

    if (assetAllocated.length > 0) {
      return NextResponse.json(
        { message: "Asset is assigned to someone" },
        { status: 409 }
      );
    }
    await db
      .update(assets)
      .set({ deletedAt: sql`now()` })
      .where(eq(assets.id, id));
    return NextResponse.json(
      { message: "Asset Deleted Successfully" },
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
