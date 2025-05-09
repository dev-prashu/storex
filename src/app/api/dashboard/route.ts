import { auth } from "@/auth"; // your auth util
import { db } from "@/db"; // your drizzle instance
import { assets } from "@/db/schema";
import { eq, ne } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";
export const GET = auth(async function (req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
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

    if (query === "total" || query === ""||query===null) {
      const allAssets = await db.select().from(assets);
      const assetCountByType = allAssets.reduce(
        (acc, asset) => {
          acc[asset.type] = (acc[asset.type] || 0) + 1;
          return acc;
        },
        { ...initialAssetCount }
      );

      return NextResponse.json({
        totalCount: allAssets.length,
        assetCountByType,
      });
    } else if (query === "available") {
      const allAssets = await db
        .select()
        .from(assets)
        .where(eq(assets.status, query));
      const assetCountByType = allAssets.reduce(
        (acc, asset) => {
          acc[asset.type] = (acc[asset.type] || 0) + 1;
          return acc;
        },
        { ...initialAssetCount }
      );

      return NextResponse.json({
        totalCount: allAssets.length,
        assetCountByType,
      });
    } else if(query==="assigned"){
      const allAssets = await db
        .select()
        .from(assets)
        .where(ne(assets.status, "available"));
      const assetCountByType = allAssets.reduce(
        (acc, asset) => {
          acc[asset.type] = (acc[asset.type] || 0) + 1;
          return acc;
        },
        { ...initialAssetCount }
      );
      return NextResponse.json({
        totalCount: allAssets.length,
        assetCountByType,
      });
    }
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { message: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
});
