"use client";
import React, { useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";

interface CloudinaryResult {
  public_id: string;
  secure_url: string;
}

interface UploadImageProps {
  onUpload: (url: string) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUpload }) => {
  return (
    <>
      <CldUploadWidget
        uploadPreset="i1cgdpx9"
        options={{
          sources: ["local"],
          multiple: false,
          maxFiles: 5,
          styles: {},
        }}
        onSuccess={(result, widget) => {
          if (result.event !== "success") return;
          const info = result.info as CloudinaryResult;
          onUpload(info.secure_url);
        }}
      >
        {({ open }) => (
          <button className="btn btn-primary" onClick={() => open()}>
            Upload an Image
          </button>
        )}
      </CldUploadWidget>
    </>
  );
};

export default UploadImage;
