import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "general";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml", "image/avif"];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    console.error("Invalid file type attempted:", file.type);
    return NextResponse.json({ error: `Invalid file type: ${file.type}. Only JPG, PNG, WebP, SVG, AVIF allowed.` }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "images", folder);
  const filePath = path.join(uploadDir, filename);

  try {
    const { mkdirSync } = await import("fs");
    mkdirSync(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Saving file to:", filePath);
    await writeFile(filePath, buffer);
    console.log("File saved successfully.");

    const publicPath = `/images/${folder}/${filename}`;
    return NextResponse.json({ url: publicPath, filename });
  } catch (error) {
    console.error("Upload Error Details:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
