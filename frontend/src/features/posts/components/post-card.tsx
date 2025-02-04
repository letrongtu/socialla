import { cn } from "@/lib/utils";
import { PostType } from "../types";

import { PostImageLayout } from "./post-image-layout";
import { PostHeader } from "./post-header";
import { EngagementBar } from "./engagement-bar/engagement-bar";

import { FaEllipsis } from "react-icons/fa6";

interface PostCardProps {
  postData: PostType;
  shadow?: boolean;
}
export const PostCard = ({ postData, shadow = true }: PostCardProps) => {
  const mediaFiles = postData.fileUrls ? postData.fileUrls : [];

  return (
    <div
      className={cn(
        "bg-[#fff] rounded-lg pt-4 pb-2 flex flex-col gap-y-3",
        shadow && "shadow-md"
      )}
    >
      <div className="relative flex flex-col justify-center gap-y-3 px-4">
        {/**TODO: Make this an edit component -> reusable */}
        <div className="absolute top-0 right-4">
          <div className="p-1.5 rounded-full hover:bg-[#c9ccd1]/30 cursor-pointer">
            <FaEllipsis className="size-5 text-muted-foreground" />
          </div>
        </div>

        <PostHeader postData={postData} />

        <div className="flex flex-col gap-y-1 break-words">
          {postData.content?.map((line, index) => (
            <p key={index} className="text-base">
              {line}
            </p>
          ))}
        </div>
      </div>

      <PostImageLayout mediaFiles={mediaFiles} />

      <EngagementBar postData={postData} />
    </div>
  );
};
