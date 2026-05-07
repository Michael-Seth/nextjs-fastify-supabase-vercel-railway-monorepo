import { useState, useCallback } from "react";
import { api } from "@/lib/api";

export interface UploadResult { url: string; key: string; }
export interface UploadState { progress: number; uploading: boolean; error: string | null; result: UploadResult | null; }

export function useFileUpload() {
  const [state, setState] = useState<UploadState>({ progress: 0, uploading: false, error: null, result: null });

  const upload = useCallback(async (file: File): Promise<UploadResult | null> => {
    setState({ progress: 0, uploading: true, error: null, result: null });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await api.post<UploadResult>("/storage/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setState(s => ({ ...s, progress: Math.round((e.loaded * 100) / (e.total ?? e.loaded)) })),
      });
      setState({ progress: 100, uploading: false, error: null, result: data });
      return data;
    } catch (e) {
      const msg = (e as Error).message;
      setState({ progress: 0, uploading: false, error: msg, result: null });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ progress: 0, uploading: false, error: null, result: null }), []);

  return { ...state, upload, reset };
}
