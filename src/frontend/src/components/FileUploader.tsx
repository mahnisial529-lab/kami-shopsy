import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Film, ImageIcon, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

// ─── Single-file uploader ────────────────────────────────────────────────────

interface FileUploaderProps {
  accept: "image" | "video";
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label: string;
  ocid?: string;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];
const IMAGE_MAX = 5 * 1024 * 1024; // 5MB
const VIDEO_MAX = 50 * 1024 * 1024; // 50MB

export function FileUploader({
  accept,
  currentUrl,
  onUploaded,
  label,
  ocid,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isImage = accept === "image";
  const acceptStr = isImage
    ? "image/jpeg,image/png,image/webp"
    : "video/mp4,video/webm";
  const maxSize = isImage ? IMAGE_MAX : VIDEO_MAX;
  const validTypes = isImage ? IMAGE_TYPES : VIDEO_TYPES;
  const maxLabel = isImage ? "5MB" : "50MB";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (!validTypes.includes(file.type)) {
      setError(
        isImage
          ? "Only JPG, PNG, or WebP images are allowed."
          : "Only MP4 or WebM videos are allowed.",
      );
      return;
    }
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxLabel}.`);
      return;
    }

    setFileName(file.name);
    setUploading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onprogress = (evt) => {
      if (evt.lengthComputable) {
        setProgress(Math.round((evt.loaded / evt.total) * 90));
      }
    };
    reader.onload = () => {
      setProgress(100);
      const url = reader.result as string;
      setPreview(url);
      onUploaded(url);
      setUploading(false);
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleClear() {
    setPreview("");
    setFileName("");
    setProgress(0);
    setError("");
    onUploaded("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-body gap-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-smooth"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          data-ocid={ocid}
        >
          <Upload className="h-4 w-4" />
          {label}
        </Button>
        {(preview || fileName) && !uploading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive transition-smooth"
            onClick={handleClear}
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptStr}
        className="hidden"
        onChange={handleFileChange}
        aria-label={label}
      />

      {uploading && (
        <div className="flex flex-col gap-1">
          <Progress value={progress} className="h-1.5 w-full" />
          <p className="text-xs text-muted-foreground font-body">
            Processing... {progress}%
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive font-body" role="alert">
          {error}
        </p>
      )}

      {!uploading && isImage && preview && (
        <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border/60">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {!uploading && !isImage && fileName && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
          <Film className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
          <span className="truncate max-w-[200px]">{fileName}</span>
        </div>
      )}

      {!uploading &&
        !isImage &&
        !fileName &&
        preview &&
        preview.startsWith("http") && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
            <Film className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
            <span className="truncate max-w-[200px]">Current video</span>
          </div>
        )}

      {!uploading && isImage && !preview && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
          <ImageIcon className="h-3.5 w-3.5 flex-shrink-0" />
          <span>No image selected (JPG, PNG, WebP — max {maxLabel})</span>
        </div>
      )}
    </div>
  );
}

// ─── Multi-image uploader ────────────────────────────────────────────────────

interface MultiImageUploaderProps {
  /** Current list of base64 image URLs */
  images: string[];
  /** Called whenever the images array changes (add or remove) */
  onChange: (urls: string[]) => void;
  maxImages?: number;
  ocid?: string;
}

/**
 * Allows the admin to pick multiple images at once and appends them.
 * Each uploaded thumbnail shows an X to remove it individually.
 */
export function MultiImageUploader({
  images,
  onChange,
  maxImages = 10,
  ocid,
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");

  const remaining = maxImages - images.length;

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError("");

    const allowed = files.filter((f) => IMAGE_TYPES.includes(f.type));
    if (allowed.length < files.length) {
      setError("Sirf JPG, PNG, ya WebP images allowed hain.");
    }

    const tooBig = allowed.filter((f) => f.size > IMAGE_MAX);
    if (tooBig.length) {
      setError(`${tooBig.length} image(s) bari hain (max 5MB per image).`);
      return;
    }

    const slotsLeft = maxImages - images.length;
    const toProcess = allowed.slice(0, slotsLeft);

    if (toProcess.length === 0) {
      setError(`Maximum ${maxImages} photos allowed.`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < toProcess.length; i++) {
        const url = await readFileAsDataURL(toProcess[i]);
        newUrls.push(url);
        setProgress(Math.round(((i + 1) / toProcess.length) * 100));
      }
      onChange([...images, ...newUrls]);
    } catch {
      setError("Kuch photos process nahi ho sakin. Dobara try karein.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div
              key={url.slice(-32)}
              className="relative group w-20 h-20 rounded-md overflow-hidden border border-border/60 bg-muted"
            >
              <img
                src={url}
                alt={`Item ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 right-0.5 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                aria-label={`Remove photo ${i + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
              {/* Index badge */}
              <div className="absolute bottom-0.5 left-0.5 bg-background/80 text-foreground text-[9px] font-bold font-body px-1 rounded leading-tight">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {remaining > 0 && (
        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="font-body gap-2 border-border border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 transition-smooth w-fit"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            data-ocid={ocid}
          >
            <Upload className="h-4 w-4" />
            {images.length === 0
              ? "Photos Upload Karein"
              : `Aur Photos Add Karein (${remaining} bacha)`}
          </Button>
          <p className="text-[11px] text-muted-foreground font-body">
            Ek saath kai photos select kar sakte hain · JPG, PNG, WebP · max 5MB
            each
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFilesChange}
        aria-label="Upload product photos"
      />

      {uploading && (
        <div className="flex flex-col gap-1">
          <Progress value={progress} className="h-1.5 w-full" />
          <p className="text-xs text-muted-foreground font-body">
            Photos process ho rahi hain... {progress}%
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive font-body" role="alert">
          {error}
        </p>
      )}

      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
          <ImageIcon className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Koi photo nahi (JPG, PNG, WebP — max 5MB per photo)</span>
        </div>
      )}
    </div>
  );
}
