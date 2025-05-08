import { auth } from "@/auth";
import { db } from "@/db";
import {
  accessoriesSpecs,
  assets,
  hardDiskSpecs,
  laptopSpecs,
  mobileSpecs,
  monitorSpecs,
  pendriveSpecs,
  ramSpecs,
  simSpecs,
} from "@/db/schema";
import { isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async function () {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }
  try {
    const asset = await db
      .select()
      .from(assets)
      .where(isNull(assets.deletedAt));
    return NextResponse.json({ assets: asset }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function (req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
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

    const [asset] = await db
      .insert(assets)
      .values({
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
        createdBy: session.user?.id,
        clientName: ownedBy === "client" ? clientName : null,
      })
      .returning({ assetId: assets.id });
    const assetId = asset.assetId;
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
        await db.insert(laptopSpecs).values({
          series,
          processor,
          ram,
          os: operatingSystem,
          screenRes: screenResolution,
          storage: storage,
          charger: charger,
          assetId: assetId,
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
        await db.insert(monitorSpecs).values({
          assetId,
          screenRes: screenResolution,
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
        await db.insert(pendriveSpecs).values({ assetId, storage });
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
          .values({ assetId, storage, type: diskType });
        break;
      }
      case "mobile": {
        if (!imei1 || !imei2 || !imei3) {
          return NextResponse.json(
            { message: "IMEI is missing" },
            { status: 400 }
          );
        }
        await db.insert(mobileSpecs).values({
          imei1,
          imei2,
          imei3,
          assetId,
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
        await db.insert(simSpecs).values({
          simno: simNo,
          phone: phoneNo,
          assetId,
        });
        break;
      }

      case "mouse": {
        await db.insert(accessoriesSpecs).values({
          type: "mouse",
          assetId,
        });
        break;
      }
      case "ram": {
        if (!capacity) {
          return NextResponse.json(
            { message: "Capacity is missing" },
            { status: 400 }
          );
        }
        await db.insert(ramSpecs).values({
          capacity,
          assetId,
          remark,
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
          case "cable":
          case "keyboard": {
            await db.insert(accessoriesSpecs).values({
              type: accessoryType,
              remark,
              assetId,
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

            await db.insert(accessoriesSpecs).values({
              type: "other",
              remark,
              assetId,
            });
            break;
          }
        }
      }
    }

    console.log(body);
    return NextResponse.json(
      { message: "Asset Added Successfully" },
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
