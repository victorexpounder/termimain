"use client";

import * as pdfjsLib from "pdfjs-dist/webpack";

export async function convertPdfToImage(file: File): Promise<File | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvas,
      viewport,
    }).promise;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    if (!blob) return null;

    return new File(
      [blob],
      file.name.replace(/\.pdf$/i, "") + ".png",
      { type: "image/png" }
    );
  } catch (err) {
    console.error("PDF conversion failed:", err);
    return null;
  }
}