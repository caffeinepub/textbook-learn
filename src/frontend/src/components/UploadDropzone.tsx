import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCreateBook } from "@/hooks/useQueries";
import { parsePDF } from "@/utils/pdfParser";
import { useNavigate } from "@tanstack/react-router";
import { CloudUpload, FileText, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type Stage = "idle" | "parsing" | "uploading" | "done";

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const createBook = useCreateBook();
  const navigate = useNavigate();

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".pdf")) {
        toast.error("Please upload a PDF file.");
        return;
      }
      setSelectedFile(file);
      setStage("parsing");
      setProgress(0);

      try {
        const segments = await parsePDF(file, (p) => setProgress(p));
        setStage("uploading");
        setProgress(0);

        const bookId = await createBook.mutateAsync({
          name: file.name.replace(/\.pdf$/i, ""),
          segments,
        });

        setStage("done");
        toast.success("Book uploaded successfully!");
        navigate({
          to: "/study/$bookId",
          params: { bookId: bookId.toString() },
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to process PDF. Please try again.");
        setStage("idle");
        setSelectedFile(null);
      }
    },
    [createBook, navigate],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const isLoading = stage === "parsing" || stage === "uploading";

  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 ${
        isDragging ? "scale-[1.02]" : ""
      }`}
      style={{
        border: `2px dashed ${
          isDragging ? "oklch(0.77 0.12 200)" : "oklch(0.37 0.06 220)"
        }`,
        background: isDragging
          ? "oklch(0.77 0.12 200 / 0.08)"
          : "oklch(0.205 0.048 237 / 0.6)",
        backdropFilter: "blur(12px)",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      data-ocid="upload.dropzone"
    >
      <div className="p-10 flex flex-col items-center gap-5">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <Loader2
                className="w-14 h-14 animate-spin"
                style={{ color: "oklch(0.77 0.12 200)" }}
              />
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {stage === "parsing"
                    ? "Scanning textbook…"
                    : "Saving to library…"}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(0.68 0.035 240)" }}
                >
                  {selectedFile?.name}
                </p>
              </div>
              <div className="w-full max-w-xs">
                <Progress
                  value={stage === "parsing" ? progress : undefined}
                  className="h-2"
                  data-ocid="upload.loading_state"
                />
                <p
                  className="text-xs text-center mt-2"
                  style={{ color: "oklch(0.68 0.035 240)" }}
                >
                  {stage === "parsing"
                    ? `${progress}% pages processed`
                    : "Indexing content…"}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-5"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <CloudUpload
                  className="w-16 h-16"
                  style={{
                    color: isDragging
                      ? "oklch(0.77 0.12 200)"
                      : "oklch(0.55 0.06 220)",
                  }}
                />
              </motion.div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Drop your textbook PDF here
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(0.68 0.035 240)" }}
                >
                  Supports any textbook — Physics, Chemistry, Math, History and
                  more
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => inputRef.current?.click()}
                  className="font-semibold px-6"
                  style={{
                    background: "oklch(0.77 0.12 200)",
                    color: "oklch(0.12 0.04 240)",
                  }}
                  data-ocid="upload.upload_button"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Analyze Now
                </Button>
                <Button
                  variant="outline"
                  className="font-semibold px-6 border-border/60"
                  data-ocid="upload.secondary_button"
                  onClick={() => {
                    toast.info("Demo mode — upload a real PDF to get started!");
                  }}
                >
                  Explore Demo
                </Button>
              </div>
              <p className="text-xs" style={{ color: "oklch(0.55 0.03 240)" }}>
                No account required · Free to use · PDF files only
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={onInputChange}
          data-ocid="upload.upload_button"
        />
      </div>
    </div>
  );
}
