import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle2, Sparkles, Send, X } from "lucide-react";
import RatingStars from "./RatingStars";

/**
 * ReviewForm Component
 * Supports both creating a new review and editing an existing review.
 */
const ReviewForm = ({
  productId,
  initialRating = 0,
  initialReview = "",
  isEditing = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Sync initial values if editing changes
  useEffect(() => {
    setRating(initialRating);
    setReview(initialReview || "");
    setError(null);
  }, [initialRating, initialReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }

    if (review && review.length > 1000) {
      setError("Review cannot exceed 1000 characters.");
      return;
    }

    try {
      await onSubmit({
        rating: Number(rating),
        review: review.trim(),
      });

      if (!isEditing) {
        // Reset form on new review creation
        setRating(0);
        setReview("");
      }

      setSuccessMessage(
        isEditing
          ? "Your review has been updated successfully."
          : "Thank you! Your review has been submitted."
      );

      // Auto dismiss success note after 4s
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.[0]?.msg ||
        err?.message ||
        "Failed to submit your review. Please try again.";
      setError(msg);
    }
  };

  const maxChars = 1000;
  const charsLeft = maxChars - review.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--accent-gold)] mb-1">
            <Sparkles className="w-3 h-3" />
            <span>{isEditing ? "Modify Feedback" : "Share Experience"}</span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </h3>
        </div>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--bg-muted)]"
            title="Cancel editing"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Star Rating Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Overall Rating <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <RatingStars
            value={rating}
            readOnly={false}
            onChange={(val) => {
              setRating(val);
              if (error) setError(null);
            }}
            size="lg"
          />
          <span className="text-xs text-[var(--text-secondary)]">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
            {rating === 0 && "Select a star rating"}
          </span>
        </div>
      </div>

      {/* Review Text Input (Optional) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor="review-textarea"
            className="font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Review <span className="text-[var(--text-muted)] font-normal lowercase">(optional)</span>
          </label>
          <span
            className={`text-[11px] ${
              charsLeft < 50
                ? "text-rose-500 font-medium"
                : "text-[var(--text-secondary)]"
            }`}
          >
            {review.length} / {maxChars}
          </span>
        </div>

        <textarea
          id="review-textarea"
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value.slice(0, maxChars))}
          placeholder="What did you like or dislike about this product? How is the quality, fit, or craftsmanship?"
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-xs sm:text-sm bg-[var(--input-bg)] border border-[var(--border-subtle)] focus:border-[var(--text-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden transition-colors resize-y leading-relaxed"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--btn-primary)] text-[var(--btn-text)] text-xs font-semibold uppercase tracking-[0.14em] rounded-full hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{isEditing ? "Updating..." : "Submitting..."}</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3" />
              <span>{isEditing ? "Update Review" : "Submit Review"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
