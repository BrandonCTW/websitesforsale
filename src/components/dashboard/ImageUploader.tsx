"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  initialUrls?: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export function ImageUploader({ initialUrls = [], onChange, maxImages = 6 }: ImageUploaderProps) {
  const [urls, setUrls] = useState<string[]>(initialUrls)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    const remaining = maxImages - urls.length
    if (remaining <= 0) return

    const toUpload = Array.from(files).slice(0, remaining)
    setUploading(true)
    setError("")

    const newUrls: string[] = []
    for (const file of toUpload) {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      if (res.ok) {
        const { url } = await res.json()
        newUrls.push(url)
      } else {
        const data = await res.json()
        setError(data.error ?? "Upload failed.")
        break
      }
    }

    const next = [...urls, ...newUrls]
    setUrls(next)
    onChange(next)
    setUploading(false)
  }

  function remove(index: number) {
    const next = urls.filter((_, i) => i !== index)
    setUrls(next)
    onChange(next)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {urls.map((url, i) => (
            <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted shadow-sm hover:shadow-md transition-shadow duration-200">
              <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {/* Card shine sweep on hover */}
              <div className="card-shine absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              {/* Cover / position badge */}
              {i === 0 ? (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-sm pointer-events-none">
                  Cover
                </span>
              ) : (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm pointer-events-none">
                  {i + 1}
                </span>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1.5 right-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {urls.length < maxImages && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="group relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 animate-upload-zone-glow"
          onClick={() => inputRef.current?.click()}
        >
          {/* Shimmer sweep on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-indigo-100/40 dark:via-indigo-900/20 to-transparent pointer-events-none" />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 relative">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
              </div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Uploading…</p>
            </div>
          ) : (
            <div className="relative flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-all duration-200 animate-upload-bounce">
                <ImagePlus className="h-5 w-5 text-indigo-400 dark:text-indigo-500" />
              </div>
              <p className="font-semibold text-sm text-foreground">Drop images here or click to upload</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG, WebP up to 5MB · {urls.length}/{maxImages} used</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
