'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type LightboxImageProps = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  imageClassName?: string
  sizes?: string
}

export default function LightboxImage({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  sizes = '(min-width: 1536px) 1280px, (min-width: 1280px) 1100px, (min-width: 1024px) 90vw, 100vw',
}: LightboxImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openLightbox = () => {
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={openLightbox}
        className={`group block w-full text-left ${className ?? ''}`}
        aria-label={`${alt}. Open full-size image`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            quality={100}
            unoptimized
            className={imageClassName ?? 'h-auto w-full transition-transform duration-300 group-hover:scale-[1.01]'}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Click to enlarge
          </div>
        </div>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={closeLightbox}
        >
          <div className="relative max-h-[94vh] max-w-[94vw]" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-3 top-3 z-10 rounded-full border border-slate-800/15 bg-slate-900 px-3 py-1 text-sm font-semibold text-white shadow-lg shadow-slate-950/30 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-slate-950"
              aria-label="Close image preview"
            >
              Close
            </button>
            <div className="overflow-auto rounded-2xl bg-white p-2 shadow-2xl">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                quality={100}
                unoptimized
                className="rounded-xl object-contain"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  maxWidth: '94vw',
                  maxHeight: '90vh',
                }}
                priority
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
