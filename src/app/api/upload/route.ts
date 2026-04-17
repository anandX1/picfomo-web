import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
  try {
    // 1. Verify User is Logged In
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType } = (await req.json()) as { filename: string; contentType: string };

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing file details" }, { status: 400 });
    }

    // 2. Initialize Cloudflare R2 Client via AWS SDK
    // Note: OpenNext handles environment variables securely
    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    // 3. Create a Unique Secure Filename
    const uniqueFilename = `${userId}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.]/g, "_")}`;

    // 4. Generate the 60-Second VIP Ticket
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 60 });
    
    // The public URL where the image will live permanently after upload
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${uniqueFilename}`;

    return NextResponse.json({ uploadUrl: signedUrl, publicUrl }, { status: 200 });

  } catch (error: any) {
    console.error("Presigned URL Error:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}