"use client";
import React, { useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { MdUploadFile } from "react-icons/md";
import { UploadCloud } from "lucide-react";

interface CloudinaryResult {
  public_id: string;
}

const UploadImage = () => {
  const [publicId, setPublicId] = useState("");

  return (
    <>
      {publicId && (
        <CldImage src={publicId} width={270} height={180} alt="A user image" />
      )}
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
          setPublicId(info.public_id);
        }}
      >
        {({ open }) => {
          return (
            <button
              className="flex bg-n-2 text-xs justify-center items-center rounded-full p-1 gap-1"
              onClick={() => open()}
            >
              <UploadCloud width={18} height={18} color="white" /> upload
            </button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};

export default UploadImage;
