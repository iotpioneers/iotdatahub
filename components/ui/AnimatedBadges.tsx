"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const colorMap = {
  VENUE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  CATERING: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PHOTOGRAPHY:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  FLOWERS: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  MUSIC:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PLANNER:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  VIDEOGRAPHER: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  BAKERY: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  OFFICIANT: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  TRANSPORTATION:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  RENTALS:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  STATIONERY: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
  HAIR_MAKEUP:
    "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200",
  ATTIRE: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
  JEWELRY:
    "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  FAVORS:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  DEFAULT: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

interface AnimatedBadgesProps {
  items: string[];
  className?: string;
  maxItems?: number;
}

export const AnimatedBadges = ({
  items,
  className,
  maxItems = 5,
}: AnimatedBadgesProps) => {
  if (!items || items.length === 0) return null;

  const visibleItems = items.slice(0, maxItems);
  const remainingCount = items.length - maxItems;

  return (
    <div className={cn("flex flex-wrap gap-2 overflow-hidden", className)}>
      {visibleItems.map((item, index) => (
        <motion.span
          key={item}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            "text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap",
            colorMap[item as keyof typeof colorMap] || colorMap.DEFAULT
          )}
        >
          {item.replace("_", " ")}
        </motion.span>
      ))}
      {remainingCount > 0 && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        >
          +{remainingCount} more
        </motion.span>
      )}
    </div>
  );
};
