import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/prisma/database";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cafe = await prisma.cafe.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        favorites: true,
        contactInfos: true,
      },
    });

    if (!cafe) {
      return NextResponse.json({ error: "Kafe bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(cafe);
  } catch (error) {
    console.error("Error fetching cafe:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
