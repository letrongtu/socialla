import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageLayoutProps {
  imageFiles: File[];
}

export const ImageLayout = ({ imageFiles }: ImageLayoutProps) => {
  const numberOfNonDisplayImages = imageFiles.length - 2;
  return (
    <div
      className={cn(
        "w-full grid grid-cols-2 grid-rows-3 gap-0.5 items-center justify-center",
        imageFiles.length === 1 && "grid grid-cols-1 grid-rows-1",
        imageFiles.length === 2 && "grid grid-cols-2 grid-rows-2"
      )}
    >
      {imageFiles.slice(0, 3).map((file, index) => {
        const filePreviewUrl = URL.createObjectURL(file);
        return (
          <div
            key={index}
            className={cn(
              "relative rounded-lg flex items-center justify-center",
              //For the image when 1 image is uploaded
              imageFiles.length !== 1 && "h-[150px]",

              //Grid values for 3 images or more
              index === 0 &&
                imageFiles.length > 2 &&
                "col-start-1 col-end-3 row-start-1 row-end-3 h-[302px]",

              //Grid values for 2 images
              index === 0 &&
                imageFiles.length === 2 &&
                "col-start-1 col-end-3 row-start-1 row-end-2 h-[225px]",
              index === 1 &&
                imageFiles.length === 2 &&
                "col-start-1 col-end-3 row-start-2 row-end-3 h-[225px]"
            )}
          >
            <Image
              width={600}
              height={600}
              src={filePreviewUrl}
              alt={`Uploaded ${index + 1}`}
              className={cn(
                "rounded-xl object-cover w-full h-[calc(100%)]",

                //When there are more than 3 images upload
                index === 2 && imageFiles.length > 3 && "brightness-50"
              )}
            />

            {index === 2 && imageFiles.length > 3 && (
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
