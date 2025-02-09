import { useGetUser } from "@/features/auth/api/use-get-user";
import { PostType } from "../types";
import { PostAudiences } from "@/components/post-audience-picker/post-audience-picker";
import { getCreatedDisplayString } from "../helper/helper";

import emojiData from "unicode-emoji-json";
import { feelingsData } from "./feeling-data/feeling-data";

import { UserHoverCard } from "@/components/user-hover-card";
import { Hint } from "@/components/ui/hint";
import { UserButton } from "@/components/user-button";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

interface PostHeaderProps {
  postData: PostType;
}
export const PostHeader = ({ postData }: PostHeaderProps) => {
  const { data: currentUserData, isLoading: isLoadingCurrentUserData } =
    useCurrentUser();
  const { data: createdPostUser, isLoading: createdPostUserLoading } =
    useGetUser(postData.userId);

  const postAudience = PostAudiences.find(
    (audience) => audience.visibility === postData.postAudience
  );

  const currentFeeling = feelingsData.find(
    (feeling) => feeling.feeling === postData.feeling
  );

  const currentFeelingEmoji = Object.entries(emojiData).find(
    ([emoji, data]) => data.slug === currentFeeling?.emojiSlug
  )?.[0];

  if (!createdPostUser || !currentUserData) {
    return null;
  }

  const postCreatedAt = new Date(postData.createdAt);
  const {
    createdDisplayString: postCreatedDisplayString,
    createdDayDateTime: postCreatedDayDateTime,
  } = getCreatedDisplayString(postCreatedAt);

  return (
    <div className="flex items-center gap-x-2">
      <UserHoverCard user={createdPostUser} currentUser={currentUserData}>
        <UserButton user={createdPostUser} />
      </UserHoverCard>

      <div className="h-full flex flex-col">
        <div onClick={() => {}} className="flex gap-x-1">
          <UserHoverCard user={createdPostUser} currentUser={currentUserData}>
            <p className="text-base text-black font-semibold hover:underline cursor-pointer">
              {createdPostUser.firstName} {createdPostUser.lastName}
            </p>
          </UserHoverCard>

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
