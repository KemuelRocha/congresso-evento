import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Converte para buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Faz upload para Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "comprovantes", resource_type: "auto" },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Erro upload Cloudinary:", err);
    return NextResponse.json(
      { error: "Erro ao enviar arquivo" },
      { status: 500 }
    );
  }
}
