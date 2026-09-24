import React from "react";
import { Package } from "lucide-react";

const ProductGallery = ({
  images = [],
  selectedImage,
  onSelectImage,
  title = "Product",
}) => {
  const imageList = Array.isArray(images) ? images : [];
  const currentImage = selectedImage || imageList[0]?.url;

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4 w-full">
      {/* Thumbnails list (Horizontal on mobile, vertical column on sm+) */}
      {imageList.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] pb-2 sm:pb-0 scrollbar-thin">
          {imageList.map((img, index) => {
            const url = typeof img === "string" ? img : img?.url;
            const isActive = currentImage === url;

            if (!url) return null;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelectImage(url)}
                aria-label={`View image ${index + 1}`}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white border transition-all cursor-pointer ${
                  isActive
                    ? "border-[#171717] ring-1 ring-[#171717] shadow-xs"
                    : "border-[#E5E5E5] hover:border-stone-400 opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Showcase Image */}
      <div className="flex-1 relative aspect-square sm:aspect-[4/4.5] max-h-[560px] bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden flex items-center justify-center shadow-xs">
        {currentImage ? (
          <img
            src={currentImage}
            alt={title}
            className="w-full h-full object-cover object-center transition-all duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-400 p-8 text-center">
            <Package className="w-16 h-16 mb-3 stroke-[1.2]" />
            <span className="text-xs uppercase tracking-[0.16em] font-medium text-stone-400">
              No Image Available
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
