import { useId, useRef, useState } from "react";
import type { DragEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { parsePageRange } from "./lib/merge";

type AppConfig = {
  mode?: "standalone" | "embed";
  title?: string;
  subtitle?: string;
  downloadFileName?: string;
  showPrivacyNote?: boolean;
};

type MergeErrorType = "encrypted" | "damaged" | "unreadable" | "range";

type MergeItem = {
  id: string;
  file: File;
  range: string;
  pageCount?: number;
  loading: boolean;
  errorType?: MergeErrorType;
  errorMessage?: string;
};

type Notice = {
  tone: "neutral" | "success" | "error";
  title: string;
  body: string;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
};

const detectLoadError = (error: unknown) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("encrypted")) {
    return {
      errorType: "encrypted" as const,
      errorMessage: "Dieses PDF ist verschluesselt und kann lokal nicht gelesen werden."
    };
  }

  if (message.includes("invalid") || message.includes("corrupt")) {
    return {
      errorType: "damaged" as const,
      errorMessage: "Dieses PDF wirkt beschaedigt oder unvollstaendig."
    };
  }

  return {
    errorType: "unreadable" as const,
    errorMessage: "Dieses PDF konnte im Browser nicht geoeffnet werden."
  };
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export function App({ config }: { config: AppConfig }) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragItemRef = useRef<string | null>(null);
  const [items, setItems] = useState<MergeItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [notice, setNotice] = useState<Notice>({
    tone: "neutral",
    title: "Alles lokal im Browser",
    body: "Dateien bleiben auf Ihrem Geraet. Es gibt keinen Upload, keine Telemetrie und keine Wasserzeichen."
  });

  const readyItems = items.filter((item) => !item.loading && !item.errorMessage);
  const selectedPages = readyItems.reduce((total, item) => {
    if (!item.pageCount) {
      return total;
    }

    const rangeResult = parsePageRange(item.range, item.pageCount);

    return total + (rangeResult.indices?.length ?? 0);
  }, 0);

  const addFiles = async (files: File[]) => {
    const pdfFiles = files.filter(
      (file) =>
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    if (!pdfFiles.length) {
      setNotice({
        tone: "error",
        title: "Keine PDF erkannt",
        body: "Bitte laden Sie nur gueltige PDF-Dateien hoch."
      });
      return;
    }

    const nextItems = pdfFiles.map<MergeItem>((file) => ({
      id: crypto.randomUUID(),
      file,
      range: "",
      loading: true
    }));

    setItems((current) => [...current, ...nextItems]);
    setNotice({
      tone: "neutral",
      title: "Dateien werden geprueft",
      body: "Seitenzahlen und Lesbarkeit werden direkt lokal im Browser validiert."
    });

    for (const nextItem of nextItems) {
      try {
        const bytes = await nextItem.file.arrayBuffer();
        const pdfDocument = await PDFDocument.load(bytes, { ignoreEncryption: true });

        setItems((current) =>
          current.map((item) =>
            item.id === nextItem.id
              ? {
                  ...item,
                  loading: false,
                  pageCount: pdfDocument.getPageCount()
                }
              : item
          )
        );
      } catch (error) {
        const details = detectLoadError(error);

        setItems((current) =>
          current.map((item) =>
            item.id === nextItem.id
              ? {
                  ...item,
                  loading: false,
                  errorType: details.errorType,
                  errorMessage: details.errorMessage
                }
              : item
          )
        );
      }
    }

    setNotice({
      tone: "neutral",
      title: "Reihenfolge festlegen",
      body: "Ziehen Sie Dateien an die richtige Stelle, geben Sie optional Seitenbereiche an und starten Sie danach den Merge."
    });
  };

  const reorderItem = (fromId: string, toId: string) => {
    setItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === fromId);
      const toIndex = current.findIndex((item) => item.id === toId);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      return next;
    });
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);

      if (index === -1) {
        return current;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);

      return next;
    });
  };

  const mergeFiles = async () => {
    if (readyItems.length < 2) {
      setNotice({
        tone: "error",
        title: "Mindestens zwei PDFs benoetigt",
        body: "Bitte laden Sie zwei gueltige PDF-Dateien hoch, bevor Sie den Merge starten."
      });
      return;
    }

    setIsMerging(true);
    setNotice({
      tone: "neutral",
      title: "PDF wird zusammengefuehrt",
      body: "Die ausgewaehlten Seiten werden jetzt lokal im Browser kombiniert."
    });

    try {
      const mergedDocument = await PDFDocument.create();

      for (const item of readyItems) {
        const bytes = await item.file.arrayBuffer();
        const sourceDocument = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const rangeResult = parsePageRange(item.range, sourceDocument.getPageCount());

        if (rangeResult.error) {
          setItems((current) =>
            current.map((currentItem) =>
              currentItem.id === item.id
                ? {
                    ...currentItem,
                    errorType: "range",
                    errorMessage: rangeResult.error
                  }
                : currentItem
            )
          );

          throw new Error(rangeResult.error);
        }

        const copiedPages = await mergedDocument.copyPages(
          sourceDocument,
          rangeResult.indices ?? []
        );

        copiedPages.forEach((page) => mergedDocument.addPage(page));
      }

      const mergedBytes = await mergedDocument.save();
      const stamp = new Date().toISOString().slice(0, 10);
      const fileBaseName = (config.downloadFileName || "pdfzus-merge").replace(/\.pdf$/i, "");

      downloadBlob(
        new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" }),
        `${fileBaseName}-${stamp}.pdf`
      );

      setNotice({
        tone: "success",
        title: "Fertig",
        body: "Ihr zusammengefuehrtes PDF wurde erzeugt und direkt heruntergeladen."
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unbekannter Fehler";

      setNotice({
        tone: "error",
        title: "Merge fehlgeschlagen",
        body: message
      });
    } finally {
      setIsMerging(false);
    }
  };

  const rootClassName =
    config.mode === "embed" ? "pdfzusmerge-shell is-embed" : "pdfzusmerge-shell";
  const hasBlockingState =
    isMerging ||
    items.some((item) => item.loading) ||
    readyItems.length < 2;

  const onDrop = async (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files ?? []);

    if (droppedFiles.length) {
      await addFiles(droppedFiles);
    }
  };

  return (
    <section className={rootClassName}>
      <div className="pdfzusmerge-frame">
        <header className="pdfzusmerge-hero">
          <div>
            <span className="pdfzusmerge-kicker">Joomla Frontend Tool</span>
            <h1>{config.title || "PDF Zusammenfuegen von pdfzus"}</h1>
            <p>
              {config.subtitle ||
                "Mehrere PDF-Dateien lokal sortieren, Bereiche waehlen und ohne Upload zu einer einzigen Datei verbinden."}
            </p>
          </div>

          <div className="pdfzusmerge-stats" aria-label="Werkzeugstatus">
            <article>
              <span>Dateien</span>
              <strong>{items.length}</strong>
            </article>
            <article>
              <span>Bereit</span>
              <strong>{readyItems.length}</strong>
            </article>
            <article>
              <span>Seiten</span>
              <strong>{selectedPages}</strong>
            </article>
          </div>
        </header>

        <div className="pdfzusmerge-workspace">
          <button
            type="button"
            className="pdfzusmerge-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
            }}
            onDrop={onDrop}
          >
            <span className="pdfzusmerge-dropzone-kicker">Lokaler Import</span>
            <strong>PDFs hier ablegen oder auswaehlen</strong>
            <small>
              Ideal fuer Bewerbungen, Rechnungen, Reports und kompakte Sammeldateien.
            </small>
          </button>

          <input
            id={inputId}
            ref={fileInputRef}
            className="pdfzusmerge-hidden"
            type="file"
            accept="application/pdf"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);

              if (files.length) {
                void addFiles(files);
              }

              event.target.value = "";
            }}
          />

          <div className={`pdfzusmerge-notice is-${notice.tone}`}>
            <strong>{notice.title}</strong>
            <span>{notice.body}</span>
          </div>

          <div className="pdfzusmerge-toolbar">
            <span>Reihenfolge und Seitenbereiche</span>
            <label htmlFor={inputId}>
              {items.length ? "Weitere PDFs hinzufuegen" : "PDFs auswaehlen"}
            </label>
          </div>

          <div className="pdfzusmerge-list">
            {!items.length ? (
              <article className="pdfzusmerge-empty">
                <strong>Noch kein Merge-Setup vorhanden</strong>
                <p>
                  Laden Sie mindestens zwei PDF-Dateien hoch. Alles bleibt vollstaendig lokal im Browser.
                </p>
              </article>
            ) : null}

            {items.map((item, index) => (
              <article
                key={item.id}
                className={`pdfzusmerge-item ${item.errorMessage ? "is-error" : ""}`}
                draggable
                onDragStart={() => {
                  dragItemRef.current = item.id;
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();

                  if (dragItemRef.current) {
                    reorderItem(dragItemRef.current, item.id);
                  }

                  dragItemRef.current = null;
                }}
                onDragEnd={() => {
                  dragItemRef.current = null;
                }}
              >
                <div className="pdfzusmerge-item-top">
                  <div className="pdfzusmerge-file-meta">
                    <span className="pdfzusmerge-file-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong title={item.file.name}>{item.file.name}</strong>
                      <small>
                        {formatBytes(item.file.size)}
                        {" · "}
                        {item.loading
                          ? "Pruefung laeuft"
                          : item.pageCount
                            ? `${item.pageCount} Seiten`
                            : "Ohne Seitenangabe"}
                      </small>
                    </div>
                  </div>

                  <div className="pdfzusmerge-actions">
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, "up")}
                      disabled={index === 0}
                      aria-label="Datei nach oben verschieben"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, "down")}
                      disabled={index === items.length - 1}
                      aria-label="Datei nach unten verschieben"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
                      }}
                      aria-label="Datei entfernen"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <label className="pdfzusmerge-range-field">
                  <span>Seitenbereich</span>
                  <input
                    type="text"
                    value={item.range}
                    onChange={(event) => {
                      const nextRange = event.target.value;
                      setItems((current) =>
                        current.map((currentItem) =>
                          currentItem.id === item.id
                            ? {
                                ...currentItem,
                                range: nextRange,
                                errorType:
                                  currentItem.errorType === "range"
                                    ? undefined
                                    : currentItem.errorType,
                                errorMessage:
                                  currentItem.errorType === "range"
                                    ? undefined
                                    : currentItem.errorMessage
                              }
                            : currentItem
                        )
                      );
                    }}
                    placeholder="Leer lassen = alle Seiten"
                  />
                </label>

                <p className={`pdfzusmerge-status ${item.errorMessage ? "is-error" : ""}`}>
                  {item.errorMessage
                    ? item.errorMessage
                    : "Optional: zum Beispiel 1-3, 5 fuer eine gezielte Auswahl."}
                </p>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="pdfzusmerge-primary"
            onClick={() => void mergeFiles()}
            disabled={hasBlockingState}
          >
            {isMerging ? "PDF wird erstellt..." : "PDF jetzt lokal zusammenfuegen"}
          </button>

          {config.showPrivacyNote !== false ? (
            <footer className="pdfzusmerge-footer">
              <p>Keine Telemetrie. Kein Cloud-Speicher. Keine Wasserzeichen.</p>
              <p>Die Erweiterung fuehrt Dateien direkt im Browser zusammen und verlaesst das Geraet nicht.</p>
            </footer>
          ) : null}
        </div>
      </div>
    </section>
  );
}
