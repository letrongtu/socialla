import { cn } from "@/lib/utils";
import Image from "next/image";
import ReactPlayer from "react-player";

import { FaRegPlayCircle } from "react-icons/fa";

interface ImageLayoutProps {
  mediaFiles: File[];
}

export const ImageLayout = ({ mediaFiles }: ImageLayoutProps) => {
  const numberOfNonDisplayImages = mediaFiles.length - 2;

  const isVideoFile = (file: File) => file.type.startsWith("video/");

  return (
    <div
      className={cn(
        "w-full grid grid-cols-2 grid-rows-3 gap-0.5 items-center justify-center",
        mediaFiles.length === 1 && "grid grid-cols-1 grid-rows-1",
        mediaFiles.length === 2 && "grid grid-cols-2 grid-rows-2"
      )}
    >
      {mediaFiles.slice(0, 3).map((file, index) => {
        const filePreviewUrl = URL.createObjectURL(file);
        return (
          <div
            key={index}
            className={cn(
              "relative rounded-lg flex items-center justify-center",
              //For the image when 1 image is uploaded
              mediaFiles.length !== 1 && "h-[150px]",

              //Grid values for 3 images or more
              index === 0 &&
                mediaFiles.length > 2 &&
                "col-start-1 col-end-3 row-start-1 row-end-3 h-[302px]",

              //Grid values for 2 images
              index === 0 &&
                mediaFiles.length === 2 &&
                "col-start-1 col-end-3 row-start-1 row-end-2 h-[225px]",
              index === 1 &&
                mediaFiles.length === 2 &&
                "col-start-1 col-end-3 row-start-2 row-end-3 h-[225px]"
            )}
          >
            {isVideoFile(file) ? (
              <div
                className={cn(
                  "relative w-full h-[calc(100%)] bg-[#c9ccd1]/50 rounded-lg",
                  index === 0 && "min-h-[225px]",
                  index === 2 && mediaFiles.length > 3 && "brightness-50"
                )}
              >
                <ReactPlayer
                  url={filePreviewUrl}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0 object-contain brightness-75"
                />
                {(index < 2 || mediaFiles.length <= 3) && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#c9ccd1]/30 rounded-full">
                    <FaRegPlayCircle className=" text-white/90 size-14" />
                  </div>
                )}
              </div>
            ) : (
              <Image
                width={600}
                height={600}
                src={filePreviewUrl}
                alt={`Uploaded ${index + 1}`}
                className={cn(
                  "rounded-xl object-cover w-full h-[calc(100%)]",

                  //When there are more than 3 images upload
                  index === 2 && mediaFiles.length > 3 && "brightness-50"
                )}
              />
            )}

            {index === 2 && mediaFiles.length > 3 && (
              <div className="absolute flex items-center justify-center">
                <p className="text-3xl font-semibold text-white/90">
                  +{numberOfNonDisplayImages}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
