import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Sparkles,
  Info,
  LogIn,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import RatingStars from "./RatingStars";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { calculateRatingStats } from "./ratingUtils";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useProduct } from "../../hooks/useProduct";
import { getRating } from "../../services/buyer.api";

/**
 * ReviewSection Component
 * Comprehensive Ratings & Reviews section for ProductDetails and AddVariant pages.
 */
const ReviewSection = ({
  productId,
  product = null,
  isReadOnly = false,
  className = "",
}) => {
  const { user } = useAuth();
  const {
    handleRating,
    handleEditRating,
    handleDeleteRating,
    reviews,
    setReviews,
  } = useProduct();

  // Form & Interaction states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedProductId, setLoadedProductId] = useState(null);
  const [isRefreshingReviews, setIsRefreshingReviews] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Delete Confirmation Modal state
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = user?._id || user?.id;
  const reviewsLoading = Boolean(
    productId && (loadedProductId !== productId || isRefreshingReviews),
  );
  const reviewsError =
    reviewError?.productId === productId ? reviewError.message : null;

  const refreshReviews = () => {
    setIsRefreshingReviews(true);
    setReviewError(null);
    setRefreshKey((key) => key + 1);
  };

  // 1. Fetch reviews on mount or productId change
  useEffect(() => {
    if (!productId) return undefined;

    let isCurrentRequest = true;

    getRating(productId)
      .then((data) => {
        if (isCurrentRequest) {
          setReviews(Array.isArray(data?.ratings) ? data.ratings : []);
        }
      })
      .catch((err) => {
        console.error("failed to fetch review", err);
        if (isCurrentRequest) {
          setReviewError({
            productId,
            message:
              err?.response?.data?.message ||
              err?.message ||
              "Unable to load reviews for this product.",
          });
          setReviews([]);
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setLoadedProductId(productId);
          setIsRefreshingReviews(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [productId, refreshKey, setReviews]);

  // 2. Calculate aggregated statistics
  const stats = useMemo(() => {
    return calculateRatingStats(reviews);
  }, [reviews]);

  // 3. Seller check: A seller cannot review their own product
  const sellerId = product?.seller?._id || product?.seller;
  const isSellerOfProduct = Boolean(
    user &&
    sellerId &&
    currentUserId &&
    sellerId.toString() === currentUserId.toString(),
  );

  // 4. Existing review authored by current logged-in buyer
  const existingUserReview = useMemo(() => {
    if (!currentUserId || !reviews || reviews.length === 0) return null;
    return reviews.find((r) => {
      const authorId = r?.user?._id || r?.user;
      return authorId && authorId.toString() === currentUserId.toString();
    });
  }, [currentUserId, reviews]);

  // 5. Handle Review Creation
  const handleCreateSubmit = async ({ rating, review }) => {
    setIsSubmitting(true);
    try {
      await handleRating(productId, review, rating);
      refreshReviews();
      setShowCreateForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Handle Review Editing
  const handleEditSubmit = async ({ rating, review }) => {
    if (!editingReview?._id) return;
    setIsSubmitting(true);
    try {
      await handleEditRating(productId, editingReview._id, review, rating);
      refreshReviews();
      setEditingReview(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Handle Review Deletion
  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await handleDeleteRating(productId, deletingId);
      refreshReviews();
      setShowDeleteModal(false);
      setDeletingId(null);
      if (editingReview?._id === deletingId) {
        setEditingReview(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  return (
    <section
      id="product-reviews-section"
      className={`mt-14 sm:mt-20 pt-10 sm:pt-14 border-t border-[var(--border-subtle)] ${className}`}>
      {/* ── 1. Section Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--accent-gold)] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Opinions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Ratings &amp; Reviews
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Verified customer ratings, feedback, and product experiences
          </p>
        </div>

        {/* Write a review toggle button for eligible buyers */}
        {!isReadOnly &&
          !isSellerOfProduct &&
          user &&
          !existingUserReview &&
          !showCreateForm && (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--btn-primary)] text-[var(--btn-text)] text-xs font-semibold uppercase tracking-[0.14em] rounded-full hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-xs self-start sm:self-auto">
              <Plus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          )}
      </div>

      {/* ── 2. Top Summary Overview (Average + Distribution) ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        {/* Left Column: Average Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-[var(--border-subtle)]">
          {stats.hasReviews ? (
            <>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                  {stats.formattedRating}
                </span>
                <span className="text-sm sm:text-base font-normal text-[var(--text-secondary)]">
                  / 5
                </span>
              </div>

              <RatingStars
                value={stats.averageRating}
                size="lg"
                readOnly
                className="mb-2"
              />

              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Based on {stats.reviewCount}{" "}
                {stats.reviewCount === 1 ? "review" : "reviews"}
              </p>
            </>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-muted)] mx-auto flex items-center justify-center text-[var(--accent-gold)]">
                <Star className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                No reviews yet
              </h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs">
                {isReadOnly
                  ? "No customer reviews have been submitted for this product."
                  : "Be the first to review this product and share your thoughts."}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Rating Distribution Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5 p-2 sm:p-4">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.distribution[stars] || 0;
            const percent = stats.percentages[stars] || 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-12 shrink-0 justify-end">
                  <span className="font-medium text-[var(--text-primary)]">
                    {stars}
                  </span>
                  <Star className="w-3 h-3 fill-[var(--accent-gold)] text-[var(--accent-gold)]" />
                </div>

                <div className="flex-1 h-2 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent-gold)] transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="w-14 text-right text-[11px] text-[var(--text-secondary)] shrink-0 font-medium">
                  {count} {count === 1 ? "review" : "reviews"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Status Notices / Form Controls ────────────────────────── */}

      {/* Seller Viewing Own Product Restriction */}
      {isSellerOfProduct && !isReadOnly && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] mb-8">
          <Info className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
          <span>
            <strong className="text-[var(--text-primary)] font-medium">
              Seller Note:{" "}
            </strong>
            You cannot review your own product. Customer reviews will appear
            below.
          </span>
        </div>
      )}

      {/* Guest (Unauthenticated) Notice */}
      {!user && !isReadOnly && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs mb-8">
          <div className="flex items-center gap-2.5">
            <LogIn className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
            <span className="text-[var(--text-secondary)]">
              Have you purchased this product? Sign in to share your experience
              with the community.
            </span>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--btn-primary)] text-[var(--btn-text)] text-[11px] font-semibold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity shrink-0">
            <span>Sign In to Review</span>
          </Link>
        </div>
      )}

      {/* Existing User Review Highlight (with Edit & Delete actions) */}
      {!isReadOnly && user && existingUserReview && !editingReview && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--accent-gold)]/40 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-gold)] text-white">
                Your Review
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                You reviewed this product
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingReview(existingUserReview)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors cursor-pointer">
                <Pencil className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => openDeleteModal(existingUserReview._id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-xs font-medium text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RatingStars
                value={existingUserReview.rating}
                size="sm"
                readOnly
              />
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {Number(existingUserReview.rating).toFixed(1)} / 5
              </span>
            </div>

            {existingUserReview.review ? (
              <p className="text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed whitespace-pre-line">
                {existingUserReview.review}
              </p>
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic">
                You provided a star rating without written text.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Inline Form: Create New Review */}
      {!isReadOnly && showCreateForm && !existingUserReview && (
        <div className="mb-8">
          <ReviewForm
            productId={productId}
            onSubmit={handleCreateSubmit}
            onCancel={() => setShowCreateForm(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Inline Form: Edit Existing Review */}
      {!isReadOnly && editingReview && (
        <div className="mb-8">
          <ReviewForm
            productId={productId}
            initialRating={editingReview.rating}
            initialReview={editingReview.review || ""}
            isEditing={true}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingReview(null)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* ── 4. Customer Review List ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            All Customer Reviews ({reviews.length})
          </h3>
        </div>

        <ReviewList
          reviews={reviews}
          loading={reviewsLoading}
          error={reviewsError}
          currentUserId={currentUserId}
          isReadOnly={isReadOnly}
          onEdit={(r) => {
            setEditingReview(r);
            setShowCreateForm(false);
            window.scrollTo({
              top:
                document.getElementById("product-reviews-section")?.offsetTop ||
                0,
              behavior: "smooth",
            });
          }}
          onDelete={openDeleteModal}
          onRetry={refreshReviews}
          deletingId={deletingId}
        />
      </div>

      {/* ── 5. Delete Confirmation Modal ─────────────────────────────── */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  Delete Your Review?
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Are you sure you want to permanently delete your review and
                  rating? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-rose-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer shadow-xs">
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
