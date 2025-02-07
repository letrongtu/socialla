import { cn } from "@/lib/utils";
import { PostType } from "../types";

import { useCurrentUser } from "@/features/auth/api/use-current-user";

import { PostImageLayout } from "./post-image-layout";
import { PostHeader } from "./post-header";
import { EngagementBar } from "./engagement-bar/engagement-bar";

import { PostEditButton } from "./post-edit-button";

interface PostCardProps {
  postData: PostType;
  shadow?: boolean;
}
export const PostCard = ({ postData, shadow = true }: PostCardProps) => {
  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();
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
        {currentUser?.id === postData.userId && (
          <div className="absolute top-0 right-5">
            <PostEditButton postId={postData.id} />
          </div>
        )}

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
