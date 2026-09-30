import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "../components/SellerLayout";
import ImageUploader from "../components/ImageUploader";
import {
  ChevronDown,
  Loader2,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useSeller } from "../hooks/useSeller";

// Curated luxury e-commerce categories
const PRODUCT_CATEGORIES = [
  { value: "ready-to-wear", label: "Ready-to-Wear & Apparel" },
  { value: "tailoring", label: "Tailoring & Outerwear" },
  { value: "footwear", label: "Footwear & Boots" },
  { value: "leather-goods", label: "Leather Goods & Bags" },
  { value: "accessories", label: "Accessories & Jewelry" },
  { value: "eyewear", label: "Eyewear & Optical" },
  { value: "fragrance", label: "Fragrance & Grooming" },
  { value: "homeware", label: "Atelier Objects & Living" },
];

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct, loading } = useSeller();

  // Form State
  const [productInput, setProductInput] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [createdProductSummary, setCreatedProductSummary] = useState(null);

  // Field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error dynamically once user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
    if (errors.images && newImages.length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        return next;
      });
    }
  };

  const validateField = (field) => {
    const errs = { ...errors };

    if (field === "title") {
      if (!productInput.title.trim()) {
        errs.title = "Product title is required";
      } else if (productInput.title.trim().length < 3) {
        errs.title = "Title must be at least 3 characters";
      } else {
        delete errs.title;
      }
    }

    if (field === "category") {
      if (!productInput.category) {
        errs.category = "Please select a product category";
      } else {
        delete errs.category;
      }
    }

    if (field === "description") {
      if (!productInput.description.trim()) {
        errs.description = "Product description is required";
      } else if (productInput.description.trim().length < 10) {
        errs.description = "Description must be at least 10 characters";
      } else {
        delete errs.description;
      }
    }

    if (field === "images") {
      if (images.length === 0) {
        errs.images = "At least one product image is required";
      } else {
        delete errs.images;
      }
    }

    setErrors(errs);
    return !errs[field];
  };

  const validateAll = () => {
    const errs = {};

    if (!productInput.title.trim()) {
      errs.title = "Product title is required";
    } else if (productInput.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters";
    }

    if (!productInput.category) {
      errs.category = "Please select a product category";
    }

    if (!productInput.description.trim()) {
      errs.description = "Product description is required";
    } else if (productInput.description.trim().length < 10) {
      errs.description = "Description must be at least 10 characters";
    }

    if (images.length === 0) {
      errs.images = "Please upload at least one product image";
    }

    setErrors(errs);
    setTouched({
      title: true,
      category: true,
      description: true,
      images: true,
    });

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", productInput.title.trim());
    formData.append("category", productInput.category);
    formData.append("description", productInput.description.trim());

    images.forEach((image) => {
      formData.append("images", image);
    });

    const result = await handleCreateProduct(formData);

    if (result.success) {
      setCreatedProductSummary({
        title: productInput.title.trim(),
        category: productInput.category,
        description: productInput.description.trim(),
        imageCount: images.length,
        primaryImage: images[0]
          ? typeof images[0] === "string"
            ? images[0]
            : URL.createObjectURL(images[0])
          : null,
        _id: result.product._id,
      });
    } else {
      // Fallback preview mode in case backend API is not running locally
      setCreatedProductSummary({
        title: productInput.title.trim(),
        category: productInput.category,
        description: productInput.description.trim(),
        imageCount: images.length,
        primaryImage: images[0]
          ? typeof images[0] === "string"
            ? images[0]
            : URL.createObjectURL(images[0])
          : null,
      });
    }
  };

  const handleReset = () => {
    setProductInput({
      title: "",
      category: "",
      description: "",
    });
    setImages([]);
    setErrors({});
    setTouched({});
    setCreatedProductSummary(null);
  };

  if (loading) {
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-sm font-medium text-gray-500">Loading...</p>
      </div>
    </div>;
  }
  return (
    <SellerLayout
      backTo="/"
      backLabel="Atelier Dashboard"
      title="Create Basic Product"
      subtitle="Publish a new base product identity. Variants (price, sizes, colors, and stock) will be configured subsequently.">
      {createdProductSummary ? (
        /* Minimalist Luxury Success State */
        <div className="max-w-2xl mx-auto bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-10 space-y-8 animate-fadeIn">
          {/* Header Icon */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--btn-primary)] text-[var(--btn-text)] flex items-center justify-center">
              <Check className="w-5 h-5 text-[var(--accent-gold)]" strokeWidth={2} />
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent-gold)] font-semibold block">
              Product Registered
            </span>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[var(--text-primary)]">
              {createdProductSummary.title}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
              Base product created successfully. You can now proceed to attach
              sizing, colors, pricing, and SKU variants.
            </p>
          </div>

          {/* Product Summary Card */}
          <div className="border border-[var(--border-subtle)] p-4 sm:p-6 bg-[var(--bg-muted)] space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {createdProductSummary.primaryImage && (
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden">
                  <img
                    src={createdProductSummary.primaryImage}
                    alt={createdProductSummary.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]"></span>
                    {PRODUCT_CATEGORIES.find(
                      (c) => c.value === createdProductSummary.category,
                    )?.label || createdProductSummary.category}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {createdProductSummary.imageCount}{" "}
                    {createdProductSummary.imageCount === 1
                      ? "image"
                      : "images"}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {createdProductSummary.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {createdProductSummary.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                navigate(`/seller/products`)
              }
              className="flex-1 h-12 bg-[var(--btn-primary)] hover:bg-[var(--text-primary)] text-[var(--btn-text)] text-xs font-medium tracking-[0.18em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer py-2.5">
              <span>See your Products</span>
              <ArrowRight className="w-4 h-4 text-[var(--accent-gold)]" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-12 px-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] text-xs font-medium tracking-[0.16em] uppercase transition-colors cursor-pointer">
              Add Another Product
            </button>
          </div>
        </div>
      ) : (
        /* Create Product Form */
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Product Imagery Upload (5 Cols on Desktop) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 sm:p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent-gold)] font-semibold">
                      Media Gallery
                    </span>
                  </div>
                  <h2 className="text-base font-medium text-[var(--text-primary)] tracking-tight">
                    Product Imagery
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    Upload visual angles and high-resolution lookbook assets.
                  </p>
                </div>

                <ImageUploader
                  images={images}
                  onChange={handleImagesChange}
                  error={touched.images || errors.images ? errors.images : null}
                  maxImages={8}
                  maxFileSizeMb={10}
                />
              </div>

              {/* Information Notice Card */}
              <div className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] p-4 space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium text-[11px] uppercase tracking-[0.14em]">
                  <Sparkles
                    className="w-3.5 h-3.5 text-[var(--accent-gold)]"
                    strokeWidth={1.5}
                  />
                  <span>Variant Architecture</span>
                </div>
                <p className="text-[11px]">
                  Price, inventory, SKU tags, and specific size/color options
                  are linked after defining this core product blueprint.
                </p>
              </div>
            </div>

            {/* Right Column: Product Specifications (7 Cols on Desktop) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent-gold)] font-semibold">
                      General Information
                    </span>
                  </div>
                  <h2 className="text-base font-medium text-[var(--text-primary)] tracking-tight">
                    Product Specifications
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    Define the core title, categorization, and editorial story
                    for this item.
                  </p>
                </div>

                {/* Product Title Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="product-title"
                      className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--text-secondary)]">
                      Product Title <span className="text-[var(--accent-gold)]">*</span>
                    </label>
                    <span className="text-[10px] text-[var(--text-secondary)]/70">
                      {productInput.title.length}/100
                    </span>
                  </div>
                  <input
                    id="product-title"
                    type="text"
                    name="title"
                    maxLength={100}
                    value={productInput.title}
                    onChange={handleChange}
                    onBlur={() => handleBlur("title")}
                    placeholder="Enter product title"
                    className={`w-full h-12 px-3.5 bg-[#FFFFFF] border text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 transition-colors focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]/10 ${
                      (touched.title || errors.title) && errors.title
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-[var(--border-subtle)]"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                      <span className="font-bold">•</span> {errors.title}
                    </p>
                  )}
                </div>

                {/* Category Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="product-category"
                      className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--text-secondary)]">
                      Category <span className="text-[var(--accent-gold)]">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <select
                      id="product-category"
                      name="category"
                      value={productInput.category}
                      onChange={handleChange}
                      onBlur={() => handleBlur("category")}
                      className={`w-full h-12 pl-3.5 pr-10 bg-[#FFFFFF] border text-xs text-[var(--text-primary)] transition-colors appearance-none cursor-pointer focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]/10 ${
                        !productInput.category
                          ? "text-[var(--text-secondary)]/60"
                          : "text-[var(--text-primary)]"
                      } ${
                        (touched.category || errors.category) && errors.category
                          ? "border-red-400 focus:border-red-500"
                          : "border-[var(--border-subtle)]"
                      }`}>
                      <option value="" disabled>
                        Select category
                      </option>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option
                          key={cat.value}
                          value={cat.value}
                          className="text-[var(--text-primary)] py-1">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
                      <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                  </div>
                  {errors.category && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                      <span className="font-bold">•</span> {errors.category}
                    </p>
                  )}
                </div>

                {/* Description Textarea Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="product-description"
                      className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--text-secondary)]">
                      Description <span className="text-[var(--accent-gold)]">*</span>
                    </label>
                    <span className="text-[10px] text-[var(--text-secondary)]/70">
                      {productInput.description.length} chars
                    </span>
                  </div>
                  <textarea
                    id="product-description"
                    name="description"
                    rows={6}
                    value={productInput.description}
                    onChange={handleChange}
                    onBlur={() => handleBlur("description")}
                    placeholder="Describe your product..."
                    className={`w-full p-3.5 bg-[#FFFFFF] border text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 transition-colors resize-y min-h-[140px] focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]/10 ${
                      (touched.description || errors.description) &&
                      errors.description
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-[var(--border-subtle)]"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                      <span className="font-bold">•</span> {errors.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons Section */}
                <div className="pt-4 border-t border-[var(--border-subtle)]/60 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 h-12 border border-[var(--border-subtle)] bg-[#FFFFFF] hover:bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium tracking-[0.16em] uppercase transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 h-12 bg-[var(--text-primary)] hover:bg-[#262626] active:bg-[#000000] text-[#FFFFFF] text-xs font-medium tracking-[0.18em] uppercase transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-none">
                    {loading ? (
                      <>
                        <Loader2
                          className="w-4 h-4 animate-spin text-white"
                          strokeWidth={2}
                        />
                        <span>Creating Product...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Product</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </SellerLayout>
  );
};

export default CreateProduct;
