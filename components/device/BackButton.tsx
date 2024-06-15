"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();

  return (
    <span>
      <Button
        type="button"
        className="inline-flex items-center rounded-md bg-primary-blue text-sm font-semibold text-white shadow-sm hover:bg-primary-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
      </Button>
    </span>
  );
};

export default BackButton;
