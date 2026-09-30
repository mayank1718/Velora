import React from "react";
import { AlertCircle, RotateCw } from "lucide-react";

const ErrorState = ({ onRetry, message = "Something went wrong while fetching your products." }) => {
  return (
    <div className="bg-white border border-[var(--border-subtle)] p-10 sm:p-16 text-center flex flex-col items-center justify-center my-4">
      <div className="w-14 h-14 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center mb-4 text-[var(--text-secondary)]">
        <AlertCircle className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-xl md:text-2xl font-light tracking-tight text-[var(--text-primary)] mb-2">
        Unable to load products
      </h3>
      <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--text-primary)] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-black transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
