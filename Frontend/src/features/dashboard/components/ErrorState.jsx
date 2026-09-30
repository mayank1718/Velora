import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

const ErrorState = ({ message = "Unable to load products.", onRetry }) => {
  return (
    <div className="w-full py-16 px-4 text-center flex flex-col items-center justify-center bg-white border border-red-100 rounded-2xl max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)] tracking-tight mb-1">
        {message}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mb-6 leading-relaxed">
        Please check your connection and try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--text-primary)] hover:bg-[#262626] text-white text-xs font-medium uppercase tracking-[0.14em] rounded-full transition-all cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
