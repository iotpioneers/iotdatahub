"use client";

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { UploadCloud, X } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import { useEffect } from "react";

interface ImageUploaderProps {
  value?: string[];
  avatarUrl?: string;
  setAvatarUrl?: (url: string) => void;
  setMultipleUrls?: (urls: string[]) => void;
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  isLoading?: boolean;
}

interface CloudinaryResult {
  public_id: string;
  secure_url: string;
}

export function ImageUploader({
  value = [],
  avatarUrl,
  setAvatarUrl,
  setMultipleUrls,
  onChange,
  multiple = false,
  isLoading,
}: ImageUploaderProps) {
  // Initialize URLs from value prop
  useEffect(() => {
    if (multiple && value?.length > 0 && setMultipleUrls) {
      setMultipleUrls(value);
    } else if (!multiple && typeof value === "string" && setAvatarUrl) {
      setAvatarUrl(value as string);
    }
  }, [value, multiple, setMultipleUrls, setAvatarUrl]);

  const handleRemoveSingle = () => {
    if (setAvatarUrl) {
      setAvatarUrl("");
    }
    onChange("");
  };

  const handleRemoveMultiple = (index: number) => {
    const newUrls = [...value];
    newUrls.splice(index, 1);
    if (setMultipleUrls) setMultipleUrls(newUrls);
    onChange(newUrls);
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== "success") return;
    const info = result.info as CloudinaryResult;
    const url = info.secure_url;

    if (multiple) {
      const newUrls = [...value, url];
      if (setMultipleUrls) setMultipleUrls(newUrls);
      onChange(newUrls);
    } else {
      if (setAvatarUrl) setAvatarUrl(url);
      onChange(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* Single image display (when avatarUrl is provided) */}
      {avatarUrl && !multiple && (
        <div className="relative group">
          <div className="relative w-full h-64 rounded-md overflow-hidden">
            <Image
              src={avatarUrl}
              alt="Uploaded image"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <button
              type="button"
              onClick={handleRemoveSingle}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Multiple images display */}
      {multiple && value && value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-md overflow-hidden">
                <Image
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMultiple(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <CldUploadWidget
        uploadPreset="i1cgdpx9"
        options={{
          sources: ["local"],
          multiple,
          maxFiles: multiple ? 5 : 1,
        }}
        onSuccess={handleUploadSuccess}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="outline"
            className={`flex-1 flex flex-row font-semibold items-center justify-center gap-2 ${
              multiple ? "p-6" : "p-12"
            } rounded-lg border border-dashed border-gray-700 w-full`}
            onClick={() => open()}
            disabled={isLoading}
          >
            <UploadCloud
              className={`${multiple ? "h-6 w-6" : "h-8 w-8"} text-gray-400`}
            />
            <p className={`${multiple ? "text-md" : "text-lg"} text-gray-600`}>
              {multiple ? "Upload Images" : "Upload an Image"}
            </p>
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}
