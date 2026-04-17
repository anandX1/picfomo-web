import imageCompression from 'browser-image-compression';

export async function compressAndUploadImage(file: File): Promise<string> {
  try {
    // 1. COMPRESS THE IMAGE IN THE BROWSER (Saves bandwidth & API limits)
    const options = {
      maxSizeMB: 1, // Compress down to 1MB max
      maxWidthOrHeight: 1024, // Resize to max 1024px for AI APIs
      useWebWorker: true,
    };
    
    console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

    // 2. GET THE VIP UPLOAD TICKET FROM YOUR BACKEND
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: compressedFile.name,
        contentType: compressedFile.type,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as any;
      throw new Error(errorData.error || "Failed to get upload URL");
    }

    const { uploadUrl, publicUrl } = (await response.json()) as { uploadUrl: string, publicUrl: string };

    // 3. UPLOAD DIRECTLY TO CLOUDFLARE R2
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: compressedFile,
      headers: {
        "Content-Type": compressedFile.type,
      },
    });

    if (!uploadResponse.ok) throw new Error("Failed to upload image to R2");

    // 4. RETURN THE PERMANENT URL
    return publicUrl;

  } catch (error) {
    console.error("Upload process failed:", error);
    throw error;
  }
}