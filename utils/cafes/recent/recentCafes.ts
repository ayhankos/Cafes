import prisma from "@/prisma/database";

export default async function GetRecentCafes() {
  const cafes = await prisma.cafe.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
    },
  });

  return cafes;
}
