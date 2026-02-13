"use client";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * Error state display with retry button
 */
export default function ErrorState({
  error,
  onRetry,
}: ErrorStateProps): JSX.Element {
  return (
    <div className="min-h-screen bg-[#080e17] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4" aria-hidden="true">
          ⚠️
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">
          Failed to Load Channel
        </h2>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
