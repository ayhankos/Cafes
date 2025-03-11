export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/prisma/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const district = searchParams.get("district");

    const cafes = await prisma.cafe.findMany({
      where: {
        ...(city && { city }),
        ...(district && { district }),
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
