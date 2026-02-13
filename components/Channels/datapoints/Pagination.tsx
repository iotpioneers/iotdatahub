"use client";

import { motion } from "framer-motion";
import { PaginationInfo } from "./channel-types";

interface PaginationProps {
  pagination: PaginationInfo;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/**
 * Pagination component for navigating through devices
 */
export default function Pagination({
  pagination,
  onNextPage,
  onPrevPage,
  onPageChange,
  isLoading = false,
}: PaginationProps): JSX.Element | null {
  if (pagination.totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  // Generate page numbers to display
  const getPageNumbers = (): number[] => {
    const { currentPage, totalPages } = pagination;
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push(-1); // Ellipsis
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(-1); // Ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-primary/5 border-primary/10 rounded-xl p-4"
    >
      {/* Page info */}
      <div className="text-sm text-slate-400">
        Showing{" "}
        <span className="font-medium text-white">
          {(pagination.currentPage - 1) * pagination.pageSize + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium text-white">
          {Math.min(
            pagination.currentPage * pagination.pageSize,
            pagination.totalDevices
          )}
        </span>{" "}
        of{" "}
        <span className="font-medium text-white">
          {pagination.totalDevices}
        </span>{" "}
        devices
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={onPrevPage}
          disabled={!pagination.hasPrevPage || isLoading}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white"
          aria-label="Previous page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === -1) {
              // Ellipsis
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1.5 text-slate-600"
                >
                  ...
                </span>
              );
            }

            const isActive = pageNum === pagination.currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => !isActive && onPageChange(pageNum)}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                    : "bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={onNextPage}
          disabled={!pagination.hasNextPage || isLoading}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white"
          aria-label="Next page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
