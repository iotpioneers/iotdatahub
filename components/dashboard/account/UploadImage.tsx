"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryResult {
  public_id: string;
  secure_url: string;
}

interface UploadImageProps {
  onUpload: (url: string) => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
          <Button
            component="button"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onClick={() => open()}
          >
            Upload an Image
            <VisuallyHiddenInput type="button" />
          </Button>
        )}
      </CldUploadWidget>
    </>
  );
};

export default UploadImage;
