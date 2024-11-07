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
    const { content } = json;

    if (!content) {
      return NextResponse.json(
        { error: "Yorum içeriği gereklidir" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        cafeId: params.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    const updatedCafe = await prisma.cafe.findUnique({
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
      },
    });

    return NextResponse.json(updatedCafe);
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json(
      { error: "Yorum eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
