import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useBuyer } from "../hooks/useBuyer";
import BuyerNavbar from "../components/BuyerNavbar";
import ErrorState from "../components/ErrorState";
import ProductGallery from "../components/product-details/ProductGallery";
import ProductInfo from "../components/product-details/ProductInfo";
import ProductDetailsInfo from "../components/product-details/ProductDetailsInfo";
import ProductDetailsSkeleton from "../components/product-details/ProductDetailsSkeleton";
import { ChevronRight, ArrowLeft, ShieldCheck, PackageX } from "lucide-react";

const ProductDetails = () => {
  const { productId } = useParams();
  const { loading, error, product, handleGetProductDetails } = useBuyer();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch product details on mount or ID change
  useEffect(() => {
    if (productId) {
      handleGetProductDetails(productId);
    }
  }, [productId, handleGetProductDetails]);

  // Sync default variant and image once product data arrives
  useEffect(() => {
    if (product) {
      const firstVariant = product?.variants?.[0] || null;
      setSelectedVariant(firstVariant);

      const defaultImage = firstVariant?.images?.[0]?.url || null;
      setSelectedImage(defaultImage);
    }
  }, [product]);

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);

    // If selected variant has its own image, update the main image view
    if (variant?.images?.[0]?.url) {
      setSelectedImage(variant.images[0].url);
    }
  };

  // Compile all available images (main product images + variant specific images if distinct)
 const galleryImages = useMemo(() => {
   if (selectedVariant?.images?.length > 0) {
     return selectedVariant.images;
   }

   return product?.images || [];
 }, [product, selectedVariant]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between selection:bg-[#171717] selection:text-white">
      {/* 1. Navbar */}
      <BuyerNavbar />

      {/* 2. Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[#737373] hover:text-[#171717] font-medium transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>

          {product && (
            <div className="hidden sm:flex items-center gap-1.5 text-[#737373] overflow-hidden text-ellipsis whitespace-nowrap">
              <Link to="/" className="hover:text-[#171717]">
                Store
              </Link>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span className="capitalize">
                {product.category || "Catalog"}
              </span>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span className="text-[#171717] font-medium truncate max-w-[200px]">
                {product.title}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic States */}
        {loading ? (
          <ProductDetailsSkeleton />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => handleGetProductDetails(productId)}
          />
        ) : !product ? (
          <div className="py-20 text-center bg-white border border-[#E5E5E5] rounded-2xl p-8 max-w-md mx-auto shadow-xs">
            <PackageX className="w-12 h-12 text-stone-400 mx-auto mb-3 stroke-[1.5]" />
            <h2 className="text-base font-medium text-[#171717] mb-1">
              Product Not Found
            </h2>
            <p className="text-xs text-[#737373] mb-6">
              The product you are looking for might have been moved or is no
              longer available.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#171717] text-white text-xs font-medium uppercase tracking-[0.14em] rounded-full hover:bg-[#262626] transition-all">
              Browse Products
            </Link>
          </div>
        ) : (
          <div>
            {/* Desktop 2 Columns / Mobile 1 Column Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Product Gallery */}
              <div className="lg:col-span-7">
                <ProductGallery
                  images={galleryImages}
                  selectedImage={selectedImage}
                  onSelectImage={setSelectedImage}
                  title={product.title}
                />
              </div>

              {/* Right Column: Product Information & Variants */}
              <div className="lg:col-span-5">
                <ProductInfo
                  title={product.title}
                  category={product.category}
                  description={product.description}
                  variants={product.variants || []}
                  selectedVariant={selectedVariant}
                  onSelectVariant={handleVariantSelect}
                />
              </div>
            </div>

            {/* Below Section: Product Details Info */}
            <ProductDetailsInfo
              category={product.category}
              variantsCount={product.variants?.length || 0}
              description={product.description}
            />
          </div>
        )}
      </main>

      {/* 3. Luxury Minimalist Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mt-12 border-t border-[#E5E5E5]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-[#737373]">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} VELORA</span>
          <span className="text-[#E5E5E5]">•</span>
          <span>CURATED SHOPPING</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/seller/products"
            className="hover:text-[#171717] transition-colors">
            Seller Atelier
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 text-[#737373]/80">
            <ShieldCheck
              className="w-3.5 h-3.5 text-[#D4AF37]"
              strokeWidth={1.5}
            />
            <span className="text-[10px]">Secure Experience</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;
