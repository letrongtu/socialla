import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGetUser } from "@/features/auth/api/use-get-user";
import { PostType } from "../types";
import { PostAudiences } from "@/components/post-audience-picker/post-audience-picker";
import { getPostCreatedDisplayString } from "../helper/helper";

import emojiData from "unicode-emoji-json";
import { feelingsData } from "./feeling-data/feeling-data";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hint } from "@/components/ui/hint";

interface PostHeaderProps {
  postData: PostType;
}
export const PostHeader = ({ postData }: PostHeaderProps) => {
  // const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  const { data: createdPostUser, isLoading: createdPostUserLoading } =
    useGetUser({ userId: postData.userId });

  const postAudience = PostAudiences.find(
    (audience) => audience.visibility === postData.postAudience
  );

  const currentFeeling = feelingsData.find(
    (feeling) => feeling.feeling === postData.feeling
  );

  const currentFeelingEmoji = Object.entries(emojiData).find(
    ([emoji, data]) => data.slug === currentFeeling?.emojiSlug
  )?.[0];

  if (!createdPostUser) {
    return null;
  }

  const avatarFallback = createdPostUser?.firstName?.charAt(0).toUpperCase();

  const postCreatedAt = new Date(postData.createdAt);
  const { postCreatedDisplayString, postCreatedDayDateTime } =
    getPostCreatedDisplayString(postCreatedAt);

  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="rounded size-11 hover:opacity-75 transition cursor-pointer">
        <AvatarImage
          alt={createdPostUser.firstName}
          src={createdPostUser.profilePictureUrl}
        />
        <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-xl">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div className="h-full flex flex-col">
        <div onClick={() => {}} className="flex gap-x-1">
          <p className="text-base text-black font-semibold hover:underline cursor-pointer">
            {createdPostUser.firstName} {createdPostUser.lastName}
          </p>

          {postData.feeling && (
            <p className="text-base font-semibold">
              is {currentFeelingEmoji} feeling {postData.feeling}
            </p>
          )}
        </div>

        <div onClick={() => {}} className="flex items-center gap-x-2">
          <Hint label={postCreatedDayDateTime} side="bottom">
            <p className="text-xs font-semibold text-muted-foreground hover:underline cursor-pointer">
              {postCreatedDisplayString}
            </p>
          </Hint>

          {postAudience?.icon && postAudience.visibility && (
            <Hint label={postAudience.visibility}>
              <postAudience.icon className="size-3 text-muted-foreground" />
            </Hint>
          )}
        </div>
      </div>
    </div>
  );
};
