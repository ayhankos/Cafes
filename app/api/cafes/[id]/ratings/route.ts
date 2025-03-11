export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import prisma from "@/prisma/database";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const { rating } = json;

    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return NextResponse.json({ error: "Geçersiz puan" }, { status: 400 });
    }

    // Önceki puanlamayı kontrol et ve güncelle veya yeni oluştur
    const existingRating = await prisma.rating.findFirst({
      where: {
        cafeId: params.id,
        userId: session.user.id,
      },
    });

    const updatedRating = await prisma.rating.upsert({
      where: {
        id: existingRating?.id ?? "",
      },
      update: {
        rating: rating,
      },
      create: {
        rating: rating,
        cafeId: params.id,
        userId: session.user.id,
      },
    });

    // Güncellenmiş cafe bilgilerini döndür
    const updatedCafe = await prisma.cafe.findUnique({
      where: { id: params.id },
      include: {
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
      },
    });

    return NextResponse.json(updatedCafe);
  } catch (error) {
    console.error("Error rating cafe:", error);
    return NextResponse.json(
      { error: "Puan verilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
