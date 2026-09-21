import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, X, Plus, AlertCircle, Sparkles } from "lucide-react";

const ImageUploader = ({
  images = [],
  onChange,
  error = null,
  maxImages = 8,
  maxFileSizeMb = 10,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState(null);

  const handleFiles = (fileList) => {
    setUploadNotice(null);
    if (!fileList || fileList.length === 0) return;

    const acceptedFiles = [];
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

    Array.from(fileList).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setUploadNotice(`${file.name} is not a supported format (JPG, PNG, WEBP).`);
        return;
      }
      if (file.size > maxFileSizeMb * 1024 * 1024) {
        setUploadNotice(`${file.name} exceeds the ${maxFileSizeMb}MB limit.`);
        return;
      }
      acceptedFiles.push(file);
    });

    if (acceptedFiles.length === 0) return;

    // Check max image limit
    const combined = [...images, ...acceptedFiles];
    if (combined.length > maxImages) {
      setUploadNotice(`Maximum of ${maxImages} images allowed. First ${maxImages} kept.`);
      onChange(combined.slice(0, maxImages));
    } else {
      onChange(combined);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (indexToRemove, e) => {
    e.stopPropagation();
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and Count Header */}
      <div className="flex items-center justify-between">
        <label className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[#737373]">
          Product Imagery <span className="text-[#D4AF37]">*</span>
        </label>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[#737373]">
          {images.length}/{maxImages} {images.length === 1 ? "Image" : "Images"}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length === 0 ? (
        /* Empty Upload Dropzone State */
        <div
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openFileDialog()}
          aria-label="Upload product images"
          className={`relative border border-dashed transition-all duration-200 p-8 md:p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-[#FFFFFF] group focus:outline-none ${
            isDragging
              ? "border-[#171717] bg-[#FAFAF9] ring-2 ring-[#171717]/10"
              : error
              ? "border-red-400 bg-red-50/20"
              : "border-[#E5E5E5] hover:border-[#171717]"
          }`}
        >
          {/* Icon Badge */}
          <div className="w-12 h-12 mb-4 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center text-[#171717] group-hover:border-[#171717] transition-colors">
            <Upload className="w-5 h-5 text-[#171717] transition-transform group-hover:-translate-y-0.5" strokeWidth={1.5} />
          </div>

          <p className="text-xs uppercase tracking-[0.16em] font-medium text-[#171717] mb-1">
            Drag & Drop or <span className="underline underline-offset-4 text-[#171717]">Browse Images</span>
          </p>
          <p className="text-[11px] text-[#737373] leading-relaxed max-w-xs mt-1">
            Upload multiple studio-quality angles of your product.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[#737373]/80">
            <span>PNG, JPG, WEBP</span>
            <span className="text-[#E5E5E5]">•</span>
            <span>Up to {maxFileSizeMb}MB each</span>
          </div>
        </div>
      ) : (
        /* Images Selected State - Gallery Grid */
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
            {images.map((file, index) => {
              const previewUrl = typeof file === "string" ? file : URL.createObjectURL(file);

              return (
                <div
                  key={`${file.name || index}-${index}`}
                  className="group relative aspect-square bg-[#FFFFFF] border border-[#E5E5E5] overflow-hidden transition-all duration-150 hover:border-[#171717]"
                >
                  <img
                    src={previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                    onLoad={() => {
                      if (typeof file !== "string") {
                        // URL will be retained during component lifecycle
                      }
                    }}
                  />

                  {/* Top Badges & Actions Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      {index === 0 ? (
                        <span className="text-[9px] uppercase tracking-[0.14em] font-medium bg-[#171717] text-[#FFFFFF] px-2 py-0.5 border border-white/20">
                          Main Cover
                        </span>
                      ) : (
                        <span className="text-[9px] uppercase tracking-[0.14em] text-[#FFFFFF]/80 font-mono px-1">
                          #{index + 1}
                        </span>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(index, e)}
                        className="w-6 h-6 bg-[#171717]/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove image"
                        aria-label="Remove image"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="text-[10px] text-white/90 truncate font-mono tracking-tight px-0.5">
                      {file.name || `Image ${index + 1}`}
                    </div>
                  </div>

                  {/* Static Cover Badge (visible even without hover) */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 group-hover:hidden">
                      <span className="text-[9px] uppercase tracking-[0.14em] font-medium bg-[#171717] text-[#FFFFFF] px-1.5 py-0.5 shadow-sm">
                        Cover
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add More Slot (if under maxImages) */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={openFileDialog}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="aspect-square border border-dashed border-[#E5E5E5] hover:border-[#171717] bg-[#FFFFFF] hover:bg-[#FAFAF9] transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center mb-1.5 group-hover:border-[#171717] transition-colors">
                  <Plus className="w-4 h-4 text-[#737373] group-hover:text-[#171717]" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#737373] group-hover:text-[#171717]">
                  Add Image
                </span>
                <span className="text-[9px] text-[#737373]/60 mt-0.5">
                  {maxImages - images.length} remaining
                </span>
              </button>
            )}
          </div>

          {/* Helper Microcopy under previews */}
          <div className="flex items-center justify-between text-[11px] text-[#737373] px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              First image serves as primary catalogue thumbnail
            </span>
            <button
              type="button"
              onClick={openFileDialog}
              className="text-[10px] uppercase tracking-[0.14em] underline underline-offset-4 text-[#171717] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Upload More
            </button>
          </div>
        </div>
      )}

      {/* Upload Warning / Format Notice */}
      {uploadNotice && (
        <div className="p-2.5 bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] text-[#737373] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" strokeWidth={1.5} />
            <span>{uploadNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadNotice(null)}
            className="text-[10px] uppercase tracking-[0.1em] text-[#171717] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Validation Error Message */}
      {error && (
        <div className="text-[11px] text-red-600 flex items-center gap-1.5 pt-0.5">
          <span className="font-bold">•</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
