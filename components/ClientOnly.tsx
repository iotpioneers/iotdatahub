"use client";

import { useEffect, useState } from "react";

export default function ClientOnly({
  children,
  defer = true,
}: {
  children: React.ReactNode;
  defer?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Clean up browser extension attributes
    const cleanup = () => {
      document
        .querySelectorAll("[data-new-gr-c-s-check-loaded]")
        .forEach((el) => {
          el.removeAttribute("data-new-gr-c-s-check-loaded");
        });
      document.querySelectorAll("[data-gr-ext-installed]").forEach((el) => {
        el.removeAttribute("data-gr-ext-installed");
      });
    };

    cleanup();
    return () => cleanup();
  }, []);

  if (!mounted && defer) {
    return null;
  }

  return <>{children}</>;
}
