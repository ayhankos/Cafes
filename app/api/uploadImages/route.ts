export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path, { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const imageUrls: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now().toString();
      const filename = `${uniqueSuffix}${path.extname(file.name)}`;
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      const imagePath = `/uploads/${filename}`;
      imageUrls.push(imagePath);
    }

    return NextResponse.json(imageUrls, { status: 200 });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
