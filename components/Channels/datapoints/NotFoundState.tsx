"use client";

/**
 * Not found state when channel doesn't exist
 */
export default function NotFoundState(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#080e17] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-5xl mb-4" aria-hidden="true">
          📡
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">
          Channel Not Found
        </h2>
        <p className="text-sm text-slate-500">
          This channel doesn&apos;t exist or you don&apos;t have access.
        </p>
      </div>
    </div>
  );
}
