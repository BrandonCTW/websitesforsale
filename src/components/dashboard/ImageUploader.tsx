"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

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
            <div key={url} className="relative group aspect-video rounded-lg overflow-hidden border bg-muted">
              <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
          className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {uploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <p className="font-medium">Drop images here or click to upload</p>
              <p className="mt-1 text-xs">JPEG, PNG, WebP up to 5MB · {urls.length}/{maxImages} used</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
