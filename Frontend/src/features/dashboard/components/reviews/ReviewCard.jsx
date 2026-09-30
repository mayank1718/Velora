import React from "react";
import { Pencil, Trash2, CheckCircle, User } from "lucide-react";
import RatingStars from "./RatingStars";
import { formatRelativeTime } from "./ratingUtils";

/**
 * ReviewCard Component
 * Displays individual user reviews with author options (edit/delete) when authorized.
 */
const ReviewCard = ({
  review,
  isAuthor = false,
  isReadOnly = false,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  if (!review) return null;

  const reviewerName = review.user?.fullname || "Verified Buyer";
  const initial = reviewerName.charAt(0).toUpperCase();
  const relativeDate = formatRelativeTime(review.createdAt || review.updatedAt);
  const isEdited =
    review.updatedAt &&
    review.createdAt &&
    new Date(review.updatedAt).getTime() - new Date(review.createdAt).getTime() > 60000;

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border transition-all duration-200 ${
        isAuthor
          ? "border-[var(--accent-gold)]/60 shadow-xs"
          : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        {/* User Info & Rating */}
        <div className="flex items-center gap-3">
          {/* Avatar with initial */}
          <div className="w-9 h-9 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)] shrink-0">
            {initial || <User className="w-4 h-4 text-[var(--text-secondary)]" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                {reviewerName}
              </span>

              {isAuthor && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
                  You
                </span>
              )}

              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <RatingStars value={review.rating} size="xs" readOnly />
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                {Number(review.rating).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Date & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>{relativeDate}</span>
            {isEdited && (
              <span className="text-[10px] text-[var(--text-muted)] italic">
                (edited)
              </span>
            )}
          </div>

          {/* Author Actions (Only available if current user authored this review and not in read-only mode) */}
          {isAuthor && !isReadOnly && (
            <div className="flex items-center gap-1 border-l border-[var(--border-subtle)] pl-3 ml-1">
              <button
                type="button"
                onClick={() => onEdit?.(review)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer text-xs"
                title="Edit review"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Edit</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(review._id)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 p-1.5 rounded-md text-[var(--text-secondary)] hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer text-xs"
                title="Delete review"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Text */}
      {review.review ? (
        <p className="text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-normal whitespace-pre-line mt-2 pl-0 sm:pl-12">
          {review.review}
        </p>
      ) : (
        <p className="text-xs text-[var(--text-muted)] italic mt-1 pl-0 sm:pl-12">
          Customer left a star rating without written feedback.
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
