"use client";

import { Callout } from "@radix-ui/themes";
import { error } from "console";
import React, { useState } from "react";

const CodeSnippet = ({ sampleCodes }: { sampleCodes: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipBoard = async (copyMe: string) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000); // Hide the message after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div>
      {copied && (
        <Callout.Root color="cyan" className="mb-5">
          <Callout.Text className="text-green-500 font-semibold mt-2">
            Code copied to clipboard!
          </Callout.Text>
        </Callout.Root>
      )}
      <div className="bg-gray-900 text-white p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-100 text-2xl">Sample Code</span>
          <button
            className="code bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-md"
            onClick={() => copyToClipBoard(sampleCodes)}
          >
            Copy
          </button>
        </div>
        <div className="overflow-x-auto">
          <pre id="code" className="text-gray-300">
            <code>{sampleCodes}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippet;
