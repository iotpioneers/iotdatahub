"use client";

/**
 * Skeleton loading state while channel data is being fetched.
 */
export default function PageSkeleton(): JSX.Element {
  return (
    <div
      className="space-y-6 animate-pulse"
      aria-busy="true"
      aria-label="Loading channel"
    >
      <div className="bg-primary/5 border-primary/10 rounded-2xl p-6 h-32" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_: unknown, i: number) => (
          <div
            key={i}
            className="bg-primary/5 border-primary/10 rounded-xl h-20"
          />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_: unknown, i: number) => (
        <div
          key={i}
          className="bg-primary/5 border-primary/10 rounded-2xl h-16"
        />
      ))}
    </div>
  );
}
