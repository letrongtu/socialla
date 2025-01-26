import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useUploadMediaModal } from "@/features/posts/store/use-upload-media-modal";

import { ImagePlusIcon, X } from "lucide-react";
import { ImageLayout } from "./image-layout";

interface MediaUploadInputProps {
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
}

export const MediaUploadInput = ({
  uploadedFiles,
  setUploadedFiles,
}: MediaUploadInputProps) => {
  const [, setOpenUploadMedia] = useUploadMediaModal();

  const [, setDragActive] = useState(false);

  const imageElementRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);

    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="w-full flex flex-col justify-center items-center rounded-lg border group/file-upload-input"
    >
      <input
        ref={imageElementRef}
        onChange={handleFileSelect}
        type="file"
        multiple
        className="hidden"
      />

      <div
        className={cn(
          "relative w-full max-w-[calc(100%-1rem)] min-h-60 m-2 rounded-lg flex flex-col items-center justify-center",
          uploadedFiles.length === 0 &&
            "bg-[#c9ccd1]/30 hover:bg-[#c9ccd1]/60 cursor-pointer"
        )}
      >
        {uploadedFiles.length === 0 ? (
          <div
            onClick={() => imageElementRef.current?.click()}
            className="flex flex-col items-center justify-center "
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full mb-1 bg-[#c9ccd1]/70">
              <ImagePlusIcon className="w-6 h-6 text-black" />
            </div>
            <p className="text-base font-semibold">Add photos/videos</p>
            <p className="text-xs text-muted-foreground">or drag and drop</p>
          </div>
        ) : (
          <ImageLayout mediaFiles={uploadedFiles} />
        )}

        <div
          onClick={() => {
            if (uploadedFiles.length === 0) {
              setOpenUploadMedia(false);
            } else {
              setUploadedFiles([]);
            }
          }}
          className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full mb-1 bg-[#c9ccd1]/70 cursor-pointer"
        >
          <X className="w-6 h-6 text-black" />
        </div>

        {uploadedFiles.length > 0 && (
          <div
            onClick={() => imageElementRef.current?.click()}
            className="hidden absolute top-2 left-2 items-center justify-center gap-x-1 rounded-lg px-3 py-2 bg-[#ffffff] group-hover/file-upload-input:flex cursor-pointer"
          >
            <ImagePlusIcon className="w-4 h-4 text-black" />
            <p className="text-sm font-semibold">Add photos/videos</p>
          </div>
        )}
      </div>
    </div>
  );
};
