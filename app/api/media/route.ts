import { getUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadStream } from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        // 1. Verify user is logged in
        const tokenUser = getUser(req);
        if (!tokenUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // 2. Get the file from FormData
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        // 3. Enforce strict AVIF / WebP types
        const allowedTypes = ["image/webp", "image/avif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Only WebP and AVIF images are accepted." },
                { status: 400 }
            );
        }
        const outputFormat = file.type === "image/avif" ? "avif" : "webp";
        // 4. Convert file to buffer for cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // 5. Upload to cloudinary using a stream
        const uploadResult: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "aures_thumbnails",
                    format: outputFormat,              // force output format to WebP
                    transformation: [
                        { quality: "auto:best" },
                        { fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);

        })

        // 6. Return the secure_url and the public_id
        return NextResponse.json({ url: uploadResult.secure_url, publicId: uploadResult.public_id }, { status: 201 });
    }
    catch (err) {
        console.error("Media upload error: ", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}