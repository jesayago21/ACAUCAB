import React, { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ImageProps[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  // State to manage the currently active main image
  // Initialize with the first image, or null if no images are provided
  const [activeImage, setActiveImage] = useState<ImageProps | null>(
    images && images.length > 0 ? images[0] : null
  );

  // Handle cases where no images are provided
  if (!images || images.length === 0) {
    return (
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center border rounded-2 p-4 text-muted">
        No images available for this product.
      </div>
    );
  }

  return (
    <div className="col-12 col-lg-6 d-flex flex-column flex-md-row gap-3">
      {/* Left Column: Thumbnail Gallery */}
      <div className="d-flex flex-md-column gap-3 overflow-auto order-2 order-md-1" style={{ maxHeight: '500px' }}>
        {images.map((image, index) => (
          <img
            key={index} // Use a unique key for each mapped item
            className={`w-100 max-height-150 mb-2 rounded-2 cursor-pointer border ${activeImage?.src === image.src ? 'border-primary border-2 shadow-sm' : 'border-light'}`}
            src={image.src}
            alt={image.alt}
            onClick={() => setActiveImage(image)}
            style={{ objectFit: 'cover' }} // Ensures images fit nicely
          />
        ))}
      </div>

      {/* Right Column: Main Product Image */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center order-1 order-md-2">
        {activeImage ? (
          <img
            className="w-100 rounded-2 shadow-lg"
            src={activeImage.src}
            alt={activeImage.alt}
            style={{ maxHeight: '600px', objectFit: 'contain' }} // Maintain aspect ratio
          />
        ) : (
          <div className="w-100 rounded-2 bg-light d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <span className="text-muted">Select an image</span>
          </div>
        )}
      </div>
    </div>
  );
}