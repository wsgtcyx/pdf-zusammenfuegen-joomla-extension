export type PdfSource =
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | {
      arrayBuffer: () => Promise<ArrayBuffer>;
    };

export type MergePdfSource = {
  data: PdfSource;
  pageRange?: string;
};

type PdfLibModule = typeof import("pdf-lib");

let cachedPdfLibModule: Promise<PdfLibModule> | null = null;

const getAllPageIndices = (totalPages: number) =>
  Array.from({ length: totalPages }, (_, index) => index);

export const parsePageRange = (range: string, totalPages: number) => {
  const trimmed = range.trim();

  if (!trimmed) {
    return { indices: getAllPageIndices(totalPages) };
  }

  const parts = trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const pages = new Set<number>();

  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const page = Number(part);

      if (page < 1 || page > totalPages) {
        return { error: `Seite ${page} liegt ausserhalb von 1-${totalPages}.` };
      }

      pages.add(page - 1);
      continue;
    }

    const match = part.match(/^(\d+)\s*-\s*(\d+)$/);

    if (!match) {
      return { error: `Ungueltiger Bereich "${part}". Beispiel: 1-3, 5.` };
    }

    const start = Number(match[1]);
    const end = Number(match[2]);

    if (start > end) {
      return { error: `Bereich "${part}" ist rueckwaerts notiert.` };
    }

    if (start < 1 || end > totalPages) {
      return { error: `Bereich "${part}" liegt ausserhalb von 1-${totalPages}.` };
    }

    for (let page = start; page <= end; page += 1) {
      pages.add(page - 1);
    }
  }

  if (!pages.size) {
    return { error: "Es wurden keine gueltigen Seiten ausgewaehlt." };
  }

  return { indices: Array.from(pages).sort((a, b) => a - b) };
};

const isBlob = (value: unknown): value is Blob =>
  typeof Blob !== "undefined" && value instanceof Blob;

const hasArrayBuffer = (
  value: unknown
): value is { arrayBuffer: () => Promise<ArrayBuffer> } =>
  Boolean(
    value &&
      typeof value === "object" &&
      "arrayBuffer" in value &&
      typeof (value as { arrayBuffer?: unknown }).arrayBuffer === "function"
  );

const toArrayBuffer = async (source: PdfSource): Promise<ArrayBuffer> => {
  if (source instanceof ArrayBuffer) {
    return source;
  }

  if (ArrayBuffer.isView(source)) {
    const view = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);

    return view.slice().buffer;
  }

  if (isBlob(source) || hasArrayBuffer(source)) {
    return source.arrayBuffer();
  }

  throw new TypeError("Unsupported PDF source type");
};

export const loadPdfLib = async (): Promise<PdfLibModule> => {
  if (!cachedPdfLibModule) {
    cachedPdfLibModule = import("pdf-lib");
  }

  return cachedPdfLibModule;
};

export const mergePdfs = async (inputs: MergePdfSource[]): Promise<Uint8Array> => {
  if (!inputs.length) {
    throw new Error("Mindestens eine PDF-Datei wird benoetigt.");
  }

  const { PDFDocument } = await loadPdfLib();
  const mergedDocument = await PDFDocument.create();

  for (const input of inputs) {
    const bytes = await toArrayBuffer(input.data);
    const sourceDocument = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const rangeResult = parsePageRange(input.pageRange ?? "", sourceDocument.getPageCount());

    if (rangeResult.error) {
      throw new Error(rangeResult.error);
    }

    const copiedPages = await mergedDocument.copyPages(
      sourceDocument,
      rangeResult.indices ?? []
    );

    copiedPages.forEach((page) => mergedDocument.addPage(page));
  }

  return mergedDocument.save();
};
