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

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        cafeId: params.id,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error favoriting cafe:", error);
    return NextResponse.json(
      { error: "Favorilere eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.favorite.delete({
      where: {
        userId_cafeId: {
          userId: session.user.id,
          cafeId: params.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Favorilerden kaldırılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
