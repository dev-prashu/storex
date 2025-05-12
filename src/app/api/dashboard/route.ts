import { auth } from "@/auth";
import { db } from "@/db";
import { assets } from "@/db/schema";
import { NextResponse } from "next/server";

const initialAssetCount: Record<string, number> = {
  laptop: 0,
  monitor: 0,
  hardisk: 0,
  pendrive: 0,
  mobile: 0,
  sim: 0,
  ram: 0,
  accessories: 0,
};

export const GET = auth(async function () {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const allAssets = await db.select().from(assets);

    const summary = {
      total: allAssets.length,
      assigned: allAssets.filter((asset) => asset.status !== "available")
        .length,
      available: allAssets.filter((asset) => asset.status === "available")
        .length,
    };

    const assignedAssets = allAssets.filter(
      (asset) => asset.status !== "available"
    );
    const availableAssets = allAssets.filter(
      (asset) => asset.status === "available"
    );

    const countByType = (assetsList: typeof allAssets) => {
      return assetsList.reduce(
        (counts, asset) => {
          if (asset.type in counts) {
            counts[asset.type]++;
          }
          return counts;
        },
        { ...initialAssetCount }
      );
    };

    const response = {
      summary,
      data: {
        all: countByType(allAssets),
        assigned: countByType(assignedAssets),
        available: countByType(availableAssets),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { message: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});
