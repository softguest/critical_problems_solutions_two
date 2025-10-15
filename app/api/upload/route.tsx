export const runtime = "nodejs"; // Make sure this is before all imports

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    console.log("[Cloudinary env check]", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      hasKey: !!process.env.CLOUDINARY_API_KEY,
      hasSecret: !!process.env.CLOUDINARY_API_SECRET,
    });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.warn("[Upload error] No file found in form data");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: "editorjs_uploads",
          resource_type: "auto", // handles images/videos safely
        },
        (error, result) => {
          if (error) {
            console.error("[Cloudinary upload_stream error]", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      upload.end(buffer);
    });

    console.log("[Upload success]", result);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[Upload fatal error]", error);
    return NextResponse.json(
      { error: error?.message || "Unexpected upload failure" },
      { status: 500 }
    );
  }
}
