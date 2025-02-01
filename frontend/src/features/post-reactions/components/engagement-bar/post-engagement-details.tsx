import { cn } from "@/lib/utils";

import {
  PostReactionType,
  PostReactionUserType,
} from "@/features/post-reactions/types";

import { ReactionDetails } from "./reaction-details";
import { EngagementHint } from "./engagement-hint";

interface PostEngagementDetailsProps {
  postReactions: PostReactionType[];
  enableReaction?: boolean;
  enableComment?: boolean;
  enableShare?: boolean;
}

export const PostEngagementDetails = ({
  postReactions,
  enableReaction = true,
  enableComment = true,
  enableShare = true,
}: PostEngagementDetailsProps) => {
  return (
    <div
      className={cn(
        "flex justify-end px-4",
        enableReaction && "justify-between"
      )}
    >
      {enableReaction && <ReactionDetails postReactions={postReactions} />}

      <div className="flex items-center gap-x-3">
        {enableComment && (
          <EngagementHint label="8 comments">
            <p className="text-base text-muted-foreground hover:underline cursor-pointer">
              8 comments
            </p>
          </EngagementHint>
        )}

        {enableShare && (
          <EngagementHint label="10 shares">
            <p className="text-base text-muted-foreground hover:underline cursor-pointer">
              10 shares
            </p>
          </EngagementHint>
        )}
      </div>
    </div>
  );
};
