"use client";
import React, { useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { MdUploadFile } from "react-icons/md";

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
              className="flex button bg-mauve12 justify-center items-center text-2xl rounded-full p-2 mt-2"
              onClick={() => open()}
            >
              <MdUploadFile width={24} height={24} color="white" />
              Upload
            </button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};

export default UploadImage;
