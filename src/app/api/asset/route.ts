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
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async function () {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const { assetRecords, specRecords } = await db.transaction(async (tx) => {
      const fetchedAssets = await tx
        .select()
        .from(assets)
        .where(isNull(assets.deletedAt))
        .orderBy(desc(assets.createdAt));

      const fetchedSpecs = {
        hardDisk: await tx.select().from(hardDiskSpecs),
        laptop: await tx.select().from(laptopSpecs),
        mobile: await tx.select().from(mobileSpecs),
        monitor: await tx.select().from(monitorSpecs),
        pendrive: await tx.select().from(pendriveSpecs),
        sim: await tx.select().from(simSpecs),
        accessory: await tx.select().from(accessoriesSpecs),
        ram: await tx.select().from(ramSpecs),
      };

      return {
        assetRecords: fetchedAssets,
        specRecords: fetchedSpecs,
      };
    });

    const assetsWithSpecs = assetRecords.map((asset) => {
      let specifications = null;

      switch (asset.type) {
        case "hardisk":
          specifications = specRecords.hardDisk.find(
            (s) => s.assetId === asset.id
          );
          break;
        case "laptop":
          specifications = specRecords.laptop.find(
            (s) => s.assetId === asset.id
          );
          break;
        case "mobile":
          specifications = specRecords.mobile.find(
            (s) => s.assetId === asset.id
          );
          break;
        case "monitor":
          specifications = specRecords.monitor.find(
            (s) => s.assetId === asset.id
          );
          break;
        case "pendrive":
          specifications = specRecords.pendrive.find(
            (s) => s.assetId === asset.id
          );
          break;
        case "sim":
          specifications = specRecords.sim.find((s) => s.assetId === asset.id);
          break;
        case "accessories":
          specifications = specRecords.accessory.find(
            (s) => s.assetId === asset.id
          );
          break;
        case "ram":
          specifications = specRecords.ram.find((s) => s.assetId === asset.id);
          break;
      }

      return {
        ...asset,
        specifications: specifications || null,
      };
    });

    return NextResponse.json({ assets: assetsWithSpecs }, { status: 200 });
  } catch (e) {
    console.error(e);
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

    await db.transaction(async (tx) => {
      const [asset] = await tx
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
            throw new Error("All laptop fields are required");
          }
          await tx.insert(laptopSpecs).values({
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
          if (!screenResolution)
            throw new Error("Screen Resolution Field is required");
          await tx.insert(monitorSpecs).values({
            assetId,
            screenRes: screenResolution,
          });
          break;
        }

        case "pendrive": {
          if (!storage) throw new Error("Storage Field is required");
          await tx.insert(pendriveSpecs).values({ assetId, storage });
          break;
        }

        case "hardisk": {
          if (!storage) throw new Error("Storage Field is missing");
          await tx
            .insert(hardDiskSpecs)
            .values({ assetId, storage, type: diskType });
          break;
        }

        case "mobile": {
          if (!imei1 || !imei2 || !imei3) throw new Error("IMEI is missing");
          await tx.insert(mobileSpecs).values({ imei1, imei2, imei3, assetId });
          break;
        }

        case "sim": {
          if (!simNo || !phoneNo) throw new Error("SIM Fields are missing");
          await tx
            .insert(simSpecs)
            .values({ simno: simNo, phone: phoneNo, assetId });
          break;
        }

        case "ram": {
          if (!capacity) throw new Error("Capacity is missing");
          await tx.insert(ramSpecs).values({ capacity, assetId, remark });
          break;
        }

        case "accessories": {
          if (!accessoryType) throw new Error("Accessory type is required");

          switch (accessoryType) {
            case "cable":
            case "mouse":
            case "keyboard": {
              await tx.insert(accessoriesSpecs).values({
                type: accessoryType,
                remark,
                assetId,
              });
              break;
            }
            case "other": {
              if (!remark)
                throw new Error("Remark is required for type 'other'");
              await tx.insert(accessoriesSpecs).values({
                type: "other",
                remark,
                assetId,
              });
              break;
            }
          }
          break;
        }
      }
    });

    return NextResponse.json(
      { message: "Asset Added Successfully" },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e || "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});
