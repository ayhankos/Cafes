import React, { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (currentIndex >= value.length - 1) {
      setCurrentIndex(Math.max(0, value.length - 2));
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % value.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + value.length) % value.length);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
      </div>

      {value.length > 0 && (
        <Card className="p-4">
          <div className="relative">
            <div className="relative w-full h-64 rounded-lg bg-gray-100">
              <img
                src={value[currentIndex]}
                alt={`Preview ${currentIndex + 1}`}
                className="object-contain w-full h-full"
              />
              <button
                onClick={() => handleRemoveImage(value[currentIndex])}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition z-50 cursor-pointer"
                style={{ pointerEvents: "auto" }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {value.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center pointer-events-none">
                <button
                  onClick={previousImage}
                  className="p-2 bg-black/50 text-white rounded-r hover:bg-black/70 transition pointer-events-auto"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="p-2 bg-black/50 text-white rounded-l hover:bg-black/70 transition pointer-events-auto"
                >
                  →
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {value.map((url, index) => (
              <div key={url} className="relative group">
                <div
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 cursor-pointer rounded-lg overflow-hidden 
                    ${index === currentIndex ? "ring-2 ring-blue-500" : ""}`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  onClick={() => handleRemoveImage(url)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition scale-0 group-hover:scale-100 z-50"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-2 text-sm text-gray-500">
            {currentIndex + 1} / {value.length}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
