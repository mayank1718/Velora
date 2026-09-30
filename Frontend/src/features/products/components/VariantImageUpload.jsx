import React, { useRef, useState } from "react";
import { Upload, X, Plus, AlertCircle, Image as ImageIcon } from "lucide-react";

const VariantImageUpload = ({
  images = [],
  onChange,
  error = null,
  maxImages = 5,
  maxFileSizeMb = 10,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState(null);

  const handleFiles = (fileList) => {
    setUploadNotice(null);
    if (!fileList || fileList.length === 0) return;

    const acceptedFiles = [];
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];

    Array.from(fileList).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setUploadNotice(
          `${file.name} is not a supported format (JPG, PNG, WEBP).`,
        );
        return;
      }
      if (file.size > maxFileSizeMb * 1024 * 1024) {
        setUploadNotice(`${file.name} exceeds the ${maxFileSizeMb}MB limit.`);
        return;
      }
      acceptedFiles.push(file);
    });

    if (acceptedFiles.length === 0) return;

    const combined = [...images, ...acceptedFiles];
    if (combined.length > maxImages) {
      setUploadNotice(
        `Maximum of ${maxImages} images allowed. First ${maxImages} selected.`,
      );
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
        <label className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--text-secondary)]">
          Variant Images <span className="text-[var(--accent-gold)]">*</span>
        </label>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
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
        /* Empty Upload Dropzone */
        <div
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && openFileDialog()
          }
          aria-label="Upload variant images"
          className={`relative border border-dashed transition-all duration-200 p-6 sm:p-8 text-center flex flex-col items-center justify-center cursor-pointer bg-[#FFFFFF] group focus:outline-none ${
            isDragging
              ? "border-[var(--text-primary)] bg-[var(--bg-canvas)] ring-2 ring-[var(--text-primary)]/10"
              : error
                ? "border-red-400 bg-red-50/20"
                : "border-[var(--border-subtle)] hover:border-[var(--text-primary)]"
          }`}>
          {/* Upload Icon */}
          <div className="w-10 h-10 mb-3 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] group-hover:border-[var(--text-primary)] transition-colors">
            <Upload
              className="w-4 h-4 text-[var(--text-primary)] transition-transform group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </div>

          <p className="text-xs uppercase tracking-[0.16em] font-medium text-[var(--text-primary)] mb-1">
            Drag & Drop or{" "}
            <span className="underline underline-offset-4 text-[var(--text-primary)]">
              Browse Files
            </span>
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed max-w-xs mt-0.5">
            Add up to {maxImages} images specific to this variant.
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[var(--text-secondary)]/80">
            <span>JPG, PNG, WEBP</span>
            <span className="text-[var(--border-subtle)]">•</span>
            <span>Max {maxImages} files</span>
          </div>
        </div>
      ) : (
        /* Images Preview Grid */
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {images.map((file, index) => {
              const previewUrl = URL.createObjectURL(file);

              return (
                <div
                  key={`${file.name || index}-${index}`}
                  className="group relative aspect-square bg-[#FFFFFF] border border-[var(--border-subtle)] overflow-hidden transition-all hover:border-[var(--text-primary)]">
                  <img
                    src={previewUrl}
                    alt={`Variant preview ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Top Badge & Delete Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      {index === 0 ? (
                        <span className="text-[8px] uppercase tracking-[0.12em] font-medium bg-[var(--text-primary)] text-[#FFFFFF] px-1.5 py-0.5">
                          Main
                        </span>
                      ) : (
                        <span className="text-[8px] uppercase tracking-[0.12em] text-[#FFFFFF]/80 font-mono">
                          #{index + 1}
                        </span>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(index, e)}
                        className="w-5 h-5 bg-[var(--text-primary)]/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove image"
                        aria-label="Remove image">
                        <X className="w-3 h-3" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="text-[9px] text-white/90 truncate font-mono tracking-tight">
                      {file?.name || `Image ${index + 1}`}
                    </div>
                  </div>

                  {/* Static Cover Badge */}
                  {index === 0 && (
                    <div className="absolute top-1.5 left-1.5 group-hover:hidden">
                      <span className="text-[8px] uppercase tracking-[0.12em] font-medium bg-[var(--text-primary)] text-[#FFFFFF] px-1 py-0.5">
                        Main
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add More Slot */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={openFileDialog}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="aspect-square border border-dashed border-[var(--border-subtle)] hover:border-[var(--text-primary)] bg-[#FFFFFF] hover:bg-[var(--bg-canvas)] transition-all flex flex-col items-center justify-center p-2 text-center cursor-pointer group">
                <div className="w-6 h-6 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center mb-1 group-hover:border-[var(--text-primary)] transition-colors">
                  <Plus
                    className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[9px] uppercase tracking-[0.12em] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                  Add
                </span>
                <span className="text-[8px] text-[var(--text-secondary)]/60">
                  {maxImages - images.length} left
                </span>
              </button>
            )}
          </div>

          {/* Footer format text */}
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] px-0.5">
            <span className="text-[10px] uppercase tracking-[0.12em]">
              Supported: JPG, PNG, WEBP (Max {maxFileSizeMb}MB)
            </span>
            {images.length < maxImages && (
              <button
                type="button"
                onClick={openFileDialog}
                className="text-[10px] uppercase tracking-[0.12em] underline underline-offset-4 text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer">
                Browse Files
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload notice */}
      {uploadNotice && (
        <div className="p-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle
              className="w-3.5 h-3.5 text-[var(--accent-gold)] flex-shrink-0"
              strokeWidth={1.5}
            />
            <span>{uploadNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadNotice(null)}
            className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-primary)] hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Validation Error Message */}
      {error && (
        <p className="text-[11px] text-red-600 flex items-center gap-1 pt-0.5">
          <span className="font-bold">•</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default VariantImageUpload;
