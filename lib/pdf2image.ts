// lib/pdf2image.ts
"use client";

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjs: any = null;
let loadPromise: Promise<any> | null = null;

//clean function to convert pdf to image using pdfjs-dist. This is used in the file upload component to generate a preview of the pdf. The function takes a File object as input and returns a Promise that resolves to an object containing the image URL, the converted File object, and any error message if the conversion fails. The function uses dynamic import to load the pdfjs library only when needed, and it caches the loaded library for future use. The conversion process involves rendering the first page of the PDF onto a canvas element and then converting that canvas to a PNG image blob, which is then used to create a new File object for the image preview.


export const convertPdfToImage = async (pdfFile: File): Promise<PdfConversionResult> => {
  try {
    if (!pdfjs) {
      if (!loadPromise) {
        loadPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((module) => {
          pdfjs = module;
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        });
      }
      await loadPromise;
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          const imageFile = new File([blob], `${pdfFile.name.replace(/\.pdf$/, "")}.png`, { type: "image/png" });
          resolve({ imageUrl, file: imageFile });
        } else {
          resolve({ imageUrl: "", file: null, error: "Failed to convert PDF to image." });
        }
      }, "image/png");
    });
  } catch (error) {
    console.error("Error converting PDF to image:", error);
    return { imageUrl: "", file: null, error: "An error occurred during PDF conversion." };
  }
};