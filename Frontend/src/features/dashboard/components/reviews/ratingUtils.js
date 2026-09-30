/**
 * Rating & Review Utility Functions
 * Centralized calculation logic for ratings across the application.
 */

/**
 * Calculates rating statistics from a list of rating objects.
 * @param {Array} ratings - Array of rating objects [{ rating: number, ... }]
 * @returns {Object} Calculated rating stats
 */
export const calculateRatingStats = (ratings) => {
  if (!Array.isArray(ratings) || ratings.length === 0) {
    return {
      averageRating: 0,
      formattedRating: "0.0",
      reviewCount: 0,
      hasReviews: false,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const reviewCount = ratings.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  for (const item of ratings) {
    const r = Math.round(Number(item?.rating)) || 0;
    if (r >= 1 && r <= 5) {
      distribution[r] = (distribution[r] || 0) + 1;
    }
    sum += Number(item?.rating) || 0;
  }

  const avg = reviewCount > 0 ? sum / reviewCount : 0;
  const formattedRating = avg.toFixed(1);
  const averageRating = Math.round(avg * 10) / 10;

  const percentages = {
    5: reviewCount > 0 ? Math.round((distribution[5] / reviewCount) * 100) : 0,
    4: reviewCount > 0 ? Math.round((distribution[4] / reviewCount) * 100) : 0,
    3: reviewCount > 0 ? Math.round((distribution[3] / reviewCount) * 100) : 0,
    2: reviewCount > 0 ? Math.round((distribution[2] / reviewCount) * 100) : 0,
    1: reviewCount > 0 ? Math.round((distribution[1] / reviewCount) * 100) : 0,
  };

  return {
    averageRating,
    formattedRating,
    reviewCount,
    hasReviews: reviewCount > 0,
    distribution,
    percentages,
  };
};

/**
 * Extracts and normalizes rating summary for product cards
 * Consumes product.averageRating and product.reviewCount if provided by backend,
 * or falls back to product.ratings array.
 * @param {Object} product
 * @returns {Object} Normalized summary { averageRating, formattedRating, reviewCount, hasReviews }
 */
export const getProductRatingSummary = (product) => {
  if (!product) {
    return {
      averageRating: 0,
      formattedRating: "0.0",
      reviewCount: 0,
      hasReviews: false,
    };
  }

  // 1. Direct fields if provided by backend aggregation
  if (
    typeof product.averageRating === "number" &&
    !isNaN(product.averageRating) &&
    product.averageRating > 0
  ) {
    const avg = Number(product.averageRating);
    const count = Number(product.reviewCount) || 0;
    return {
      averageRating: Math.round(avg * 10) / 10,
      formattedRating: avg.toFixed(1),
      reviewCount: count,
      hasReviews: true,
    };
  }

  // 2. Direct embedded ratings array if present
  if (Array.isArray(product.ratings) && product.ratings.length > 0) {
    return calculateRatingStats(product.ratings);
  }

  // 3. Fallback: No ratings yet
  return {
    averageRating: 0,
    formattedRating: "0.0",
    reviewCount: 0,
    hasReviews: false,
  };
};

/**
 * Formats ISO date string into relative time e.g., "2 days ago", "Just now"
 * @param {string|Date} dateString
 * @returns {string} Relative time representation
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return "Just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 5) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};
