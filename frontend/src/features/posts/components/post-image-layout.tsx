import { cn } from "@/lib/utils";
import Image from "next/image";

import { CustomVideoPlayer } from "./video-player/custom-video-player";

interface ImageLayoutProps {
  mediaFiles: string[];
}

export const PostImageLayout = ({ mediaFiles }: ImageLayoutProps) => {
  const numberOfNonDisplayImages = mediaFiles.length - 2;

  const isVideoFile = (file: string) => {
    return file.split("/").pop()?.endsWith(".mp4");
  };

  return (
    <div
      className={cn(
        "w-full grid grid-cols-2 grid-rows-3 gap-0.5 items-center justify-center",
        mediaFiles.length === 1 && "grid grid-cols-1 grid-rows-1",
        mediaFiles.length === 2 && "grid grid-cols-2 grid-rows-2"
      )}
    >
      {mediaFiles.slice(0, 3).map((fileUrl, index) => {
        return (
          <div
            key={index}
            className={cn(
              "relative flex items-center justify-center",
              //For the image when 1 image is uploaded
              mediaFiles.length !== 1 && "h-[225px]",

              //Grid values for 3 images or more
              index === 0 &&
                mediaFiles.length > 2 &&
                "col-start-1 col-end-3 row-start-1 row-end-3 h-[453px]",

              //Grid values for 2 images
              index === 0 &&
                mediaFiles.length === 2 &&
                "col-start-1 col-end-3 row-start-1 row-end-2 h-[337.5px]",
              index === 1 &&
                mediaFiles.length === 2 &&
                "col-start-1 col-end-3 row-start-2 row-end-3 h-[337.5px]"
            )}
          >
            {isVideoFile(fileUrl) ? (
              <CustomVideoPlayer
                mediaFilesLength={mediaFiles.length}
                fileIndex={index}
                fileUrl={fileUrl}
              />
            ) : (
              <Image
                width={600}
                height={600}
                src={fileUrl}
                alt={`Uploaded ${index + 1}`}
                className={cn(
                  "object-cover w-full h-[calc(100%)] cursor-pointer",

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
