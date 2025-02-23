import { useState } from "react";
import { cn } from "@/lib/utils";

import { useCurrentUser } from "@/features/auth/api/use-current-user";

import { EngagementHint } from "@/features/posts/components/engagement-bar/engagement-hint";

import { ReactionType } from "@/utils/types";
import { MessageReactionDetailsModal } from "./message-reaction-details-modal";

interface MessageReactionDetailsProps {
  messageReactions: ReactionType[];
}

export const MessageReactionDetails = ({
  messageReactions,
}: MessageReactionDetailsProps) => {
  const { data: currentUserData, isLoading } = useCurrentUser();

  const [reaction, setReaction] = useState<string | null>(null);

  if (!currentUserData) {
    return null;
  }

  const allPostReactionsObject = messageReactions.find(
    (reaction) => reaction.reaction === "All"
  );
  const totalPostReactions = allPostReactionsObject?.count || 0;

  // Push the current user to the first of the list if the user reacted to the message
  messageReactions.map((messageReaction) => {
    const currentUserReaction = messageReaction.users.find(
      (user) => user.id === currentUserData.id
    );

    if (currentUserReaction) {
      messageReaction.users = messageReaction.users.filter(
        (user) => user.id !== currentUserData.id
      );

      messageReaction.users.unshift(currentUserReaction);
    }
  });

  //Push the user to the first of the string if they reacted
  const mostTwoReactions = messageReactions
    .filter((reaction) => reaction.reaction !== "All")
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((messageReaction) => {
      const userFullNames = messageReaction.users
        .sort(
          (a, b) =>
            new Date(a.reactionCreatedAt).getTime() -
            new Date(b.reactionCreatedAt).getTime()
        )
        .slice(0, 10)
        .map((user) =>
          user.id === currentUserData.id ? "You" : user.fullName
        );

      if (messageReaction.count > 10) {
        userFullNames.push(
          `and ${messageReaction.count - userFullNames.length} more...`
        );
      }

      return {
        reaction: messageReaction.reaction,
        fullNames: userFullNames,
      };
    });

  return (
    <>
      <MessageReactionDetailsModal
        reactions={messageReactions}
        currentReaction={reaction}
        setReaction={setReaction}
      />

      <div
        onClick={() => setReaction("All")}
        className="flex items-center gap-x-1 px-0.5 rounded-full bg-[#ffffff] shadow-lg shadow-[#c9ccd1] cursor-pointer"
      >
        <div className="inline-flex items-center justify-center rounded-full cursor-pointer">
          {mostTwoReactions.map(({ reaction, fullNames }, index) => {
            return (
              <EngagementHint label="" contents={fullNames} key={index}>
                <div className={cn("rounded-full cursor-pointer")}>
                  <p className="text-sm">{reaction}</p>
                </div>
              </EngagementHint>
            );
          })}
        </div>
      </div>
    </>
  );
};
