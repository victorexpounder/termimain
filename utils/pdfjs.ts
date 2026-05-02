import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const getPdfPageCount = async (file: File) => {
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  return pdf.numPages;
}; 