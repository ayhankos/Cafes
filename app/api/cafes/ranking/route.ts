export const dynamic = "force-dynamic";

import prisma from "@/prisma/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const district = searchParams.get("district");

    const cafes = await prisma.cafe.findMany({
      where: {
        ...(city && district
          ? {
              city: decodeURIComponent(city),
              district: decodeURIComponent(district),
            }
          : {}),
      },
      include: {
        images: true,
        ratings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: cafes });
  } catch (error) {
    console.error("Error fetching cafes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
