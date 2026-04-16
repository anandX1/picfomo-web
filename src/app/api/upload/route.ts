import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Initialize the S3 Client pointed at your Cloudflare R2 Account
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the browser File object to a Buffer for S3 upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique, URL-safe filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `uploads/${Date.now()}-${safeName}`;

    // Upload directly to your R2 Bucket
    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Construct the final public URL using your dev link
    // Make sure NEXT_PUBLIC_R2_URL in .env does NOT have a trailing slash
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${fileName}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload to R2" }, { status: 500 });
  }
}