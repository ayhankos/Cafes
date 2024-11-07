import React, { useState } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (newImages: string[]) => void;
  onRemove: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
      uploadImages(fileArray);
    }
  };

  const uploadImages = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await fetch("/api/uploadImages", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const imageUrls = await response.json();
      onChange(imageUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleRemoveImage = (url: string) => {
    onRemove(url);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <div>
        {value.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Image ${index}`} />
            <button type="button" onClick={() => handleRemoveImage(url)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
