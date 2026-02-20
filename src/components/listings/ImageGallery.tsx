'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GalleryImage {
  id: number
  url: string
  displayOrder: number
}

interface ImageGalleryProps {
  images: GalleryImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, goNext, goPrev])

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  if (images.length === 0) return null

  return (
    <>
      {/* Main gallery */}
      <div className="space-y-3">
        {/* Featured image */}
        <div className="relative">
          {/* Sparkle particles around the gallery */}
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-indigo-300/70 blur-[0.5px] pointer-events-none z-10" style={{ top: '8%', left: '-1%', animationDuration: '3.3s', animationDelay: '0s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-white/65 pointer-events-none z-10" style={{ top: '70%', left: '-0.5%', animationDuration: '2.6s', animationDelay: '1.2s' }} />
          <div className="animate-sparkle absolute w-1 h-1 rounded-full bg-emerald-300/65 blur-[0.5px] pointer-events-none z-10" style={{ top: '10%', right: '-1%', animationDuration: '3.8s', animationDelay: '0.5s' }} />
          <div className="animate-sparkle absolute w-px h-px rounded-full bg-indigo-200/75 pointer-events-none z-10" style={{ top: '75%', right: '-0.5%', animationDuration: '2.9s', animationDelay: '1.9s' }} />
          <div
            className="group cursor-zoom-in rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900 relative"
            onClick={() => openLightbox(activeIndex)}
          >
            <img
              key={images[activeIndex].id}
              src={images[activeIndex].url}
              alt={`Screenshot ${activeIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] animate-fade-in"
            />
            {/* Shimmer sweep */}
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent animate-shimmer pointer-events-none" style={{ animationDelay: '2s' }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/70 rounded-full p-2.5 shadow-lg">
                <ZoomIn className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                {activeIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === activeIndex
                    ? 'border-indigo-500 animate-gallery-thumb-glow opacity-100'
                    : 'border-transparent opacity-55 hover:opacity-85 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox() }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev button */}
          {images.length > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Main image */}
          <img
            key={lightboxIndex}
            src={images[lightboxIndex].url}
            alt={`Screenshot ${lightboxIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-lightbox-enter"
          />

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setLightboxIndex(i)}
                  className={`flex-shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-all duration-200 ${
                    i === lightboxIndex
                      ? 'border-white shadow-lg opacity-100'
                      : 'border-white/25 opacity-45 hover:opacity-70'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
