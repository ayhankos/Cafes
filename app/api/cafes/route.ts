import prisma from "@/prisma/database";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const district = searchParams.get("district");

    if (!city || !district) {
      return NextResponse.json(
        { error: "City and district parameters are required" },
        { status: 400 }
      );
    }

    const cafes = await prisma.cafe.findMany({
      where: {
        city: decodeURIComponent(city),
        district: decodeURIComponent(district),
      },
      include: {
        images: true,
        ratings: true,
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

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, city, district, description, googleMapsUrl, images } = body;

    const cafe = await prisma.cafe.create({
      data: {
        name,
        city,
        district,
        description,
        googleMapsUrl,
        images: {
          create: images.map((url: string) => ({
            url,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ data: cafe }, { status: 201 });
  } catch (error) {
    console.error("Error creating cafe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const cafe = await prisma.cafe.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!cafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    }

    await prisma.cafe.delete({
      where: {
        id: id as string,
      },
    });

    return NextResponse.json({ data: cafe });
  } catch (error) {
    console.error("Error deleting cafe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
