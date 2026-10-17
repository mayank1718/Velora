import { AlertCircle, RefreshCw, Star } from "lucide-react";
import ReviewCard from "./ReviewCard";

/**
 * ReviewList Component
 * Handles rendering the list of reviews, loading skeletons, error states, and empty states.
 */
const ReviewList = ({
  reviews = [],
  loading = false,
  error = null,
  currentUserId,
  isReadOnly = false,
  onEdit,
  onDelete,
  onRetry,
  deletingId = null,
}) => {
  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--bg-muted)]" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3.5 bg-[var(--bg-muted)] rounded-xs" />
                  <div className="w-16 h-2.5 bg-[var(--bg-muted)] rounded-xs" />
                </div>
              </div>
              <div className="w-16 h-3 bg-[var(--bg-muted)] rounded-xs" />
            </div>
            <div className="space-y-1.5 pl-0 sm:pl-12 pt-1">
              <div className="w-full h-3 bg-[var(--bg-muted)] rounded-xs" />
              <div className="w-3/4 h-3 bg-[var(--bg-muted)] rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-rose-500/20 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-[var(--text-primary)]">
            Unable to load reviews
          </h4>
          <p className="text-xs text-[var(--text-secondary)]">
            {typeof error === "string" ? error : error?.message || "An unexpected error occurred."}
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--btn-primary)] text-[var(--btn-text)] text-xs font-semibold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Empty State
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-12 sm:py-16 px-6 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <div className="w-12 h-12 rounded-full bg-[var(--bg-muted)] mx-auto flex items-center justify-center text-[var(--text-secondary)]">
          <Star className="w-6 h-6 stroke-[1.5] text-[var(--accent-gold)]/60" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
            No reviews yet
          </h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {isReadOnly
              ? "Customer ratings and feedback for this product will appear here."
              : "Be the first to share your experience with this product."}
          </p>
        </div>
      </div>
    );
  }

  // 4. Render Reviews List
  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const reviewUserId = review?.user?._id || review?.user;
        const isAuthor = Boolean(
          currentUserId &&
          reviewUserId &&
          reviewUserId.toString() === currentUserId.toString()
        );

        return (
          <ReviewCard
            key={review._id}
            review={review}
            isAuthor={isAuthor}
            isReadOnly={isReadOnly}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingId === review._id}
          />
        );
      })}
    </div>
  );
};

export default ReviewList;
