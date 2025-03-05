import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("image") as File;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filename = Date.now() + "_" + file.name;

    const filePath = path.join(uploadDir, filename);

    const buffer = await file.arrayBuffer();

    if (file.size / 1024 > 500) {
      sharp(buffer).jpeg({ quality: 10 }).toFile(filePath);
    } else if (file.size / 1024 > 200) {
      sharp(buffer).jpeg({ quality: 20 }).toFile(filePath);
    } else if (file.size / 1024 > 60) {
      sharp(buffer).jpeg({ quality: 50 }).toFile(filePath);
    } else {
      fs.writeFileSync(filePath, Buffer.from(buffer));
    }

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename: filename,
    });
  } catch (error) {
    console.log(error);
    return {
      url: null,
      message: "service error",
    };
  }
}
