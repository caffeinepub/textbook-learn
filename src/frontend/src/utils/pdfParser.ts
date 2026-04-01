import * as pdfjsLib from "pdfjs-dist";

// Use the bundled worker directly via CDN-free approach
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export interface ParsedSegment {
  chapterIndex: bigint;
  chapterTitle: string;
  pageNumber: bigint;
  content: string;
}

function isChapterHeading(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 100) return false;
  if (/^chapter\s+\d+/i.test(trimmed)) return true;
  if (/^\d+\.\s+[A-Z]/.test(trimmed) && trimmed.length < 60) return true;
  if (
    trimmed === trimmed.toUpperCase() &&
    trimmed.length >= 3 &&
    trimmed.length < 50 &&
    /[A-Z]/.test(trimmed)
  )
    return true;
  return false;
}

export async function parsePDF(
  file: File,
  onProgress: (progress: number) => void,
): Promise<ParsedSegment[]> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const segments: ParsedSegment[] = [];
  let chapterIndex = 0;
  let chapterTitle = "Introduction";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress(Math.round((pageNum / pdf.numPages) * 100));
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const lines: string[] = [];
    let currentLine = "";

    for (const item of content.items) {
      const textItem = item as { str: string };
      if (textItem.str === "" || textItem.str === " ") {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
      } else {
        currentLine += textItem.str;
      }
    }
    if (currentLine.trim()) lines.push(currentLine.trim());

    for (const line of lines) {
      if (isChapterHeading(line)) {
        chapterIndex++;
        chapterTitle = line;
      }
    }

    const pageText = lines.join(" ").trim();
    if (pageText.length > 20) {
      segments.push({
        chapterIndex: BigInt(chapterIndex),
        chapterTitle,
        pageNumber: BigInt(pageNum),
        content: pageText.slice(0, 2000),
      });
    }
  }

  return segments;
}
