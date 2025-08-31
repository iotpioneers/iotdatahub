"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error" | "loading";
  onDismiss?: () => void;
  duration?: number;
};

export const Toast = ({
  message,
  type,
  onDismiss,
  duration = 5000,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const icon = {
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    loading: <Loader2 className="h-5 w-5 animate-spin text-blue-500" />,
  }[type];

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    loading: "bg-blue-50 border-blue-200",
  }[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 right-4 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${bgColor}`}
        >
          {icon}
          <span className="text-sm font-medium text-gray-900">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
