import { useState } from 'react'

type ProductGalleryProps = {
  name: string
  images: string[]
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const safeImages = images.length > 0 ? images : ['https://placehold.co/1200x900?text=Fish']
  const [selectedImage, setSelectedImage] = useState(safeImages[0])

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={selectedImage}
            alt={name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {safeImages.map((image, index) => {
          const isActive = image === selectedImage

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`overflow-hidden rounded-xl border bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={image}
                  alt={`${name} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
