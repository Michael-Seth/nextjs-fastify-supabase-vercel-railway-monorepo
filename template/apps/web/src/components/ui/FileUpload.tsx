"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, X, CheckCircle } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";

export interface FileUploadProps { accept?: Record<string, string[]>; maxSize?: number; onUploaded?: (url: string, key: string) => void; className?: string; }

export function FileUpload({ accept, maxSize = 10 * 1024 * 1024, onUploaded, className }: FileUploadProps) {
  const { upload, uploading, progress, error, result, reset } = useFileUpload();
  const onDrop = useCallback(async (files: File[]) => {
    const f = files[0]; if (!f) return;
    const r = await upload(f);
    if (r) onUploaded?.(r.url, r.key);
  }, [upload, onUploaded]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, maxSize, multiple: false });
  return (
    <div className={cn("space-y-2", className)}>
      <div {...getRootProps()} className={cn("border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors", isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50")}>
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{isDragActive ? "Drop here…" : "Drag & drop or click to select"}</p>
      </div>
      {uploading && <div className="space-y-1"><div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} /></div><p className="text-xs text-muted-foreground text-right">{progress}%</p></div>}
      {result && <div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="h-4 w-4"/><span className="truncate">{result.url}</span><button onClick={reset} className="ml-auto"><X className="h-4 w-4"/></button></div>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
