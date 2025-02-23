import { MessageType } from "../../messages/types";
import { UserType } from "@/features/auth/types";

import { useGetMessageReaction } from "../api/use-get-messsage-reaction";

import { Hint } from "@/components/ui/hint";
import { EmojiPopover } from "@/components/emoji-popover";

import { BsEmojiSmile } from "react-icons/bs";
import { UseCreateMessageReaction } from "../api/use-create-message-reaction";
import { UseDeleteMessageReaction } from "../api/use-delete-message-reaction";
import { UseUpdateMessageReaction } from "../api/use-update-message-reaction";

interface ReactionButtonProps {
  message: MessageType;
  currentUser: UserType;
  setIsMessageHovered: (isHovered: boolean) => void;
}
export const MessageReactionButton = ({
  message,
  currentUser,
  setIsMessageHovered,
}: ReactionButtonProps) => {
  const { data: currentUserReaction, isLoading: isLoadingCurrentUserReaction } =
    useGetMessageReaction(message.id, currentUser.id ? currentUser.id : null);

  const { mutate: createReaction, isPending: isPendingCreateReaction } =
    UseCreateMessageReaction();
  const { mutate: deleteReaction, isPending: isPendingDeleteReaction } =
    UseDeleteMessageReaction();
  const { mutate: updateReaction, isPending: isPendingUpdateReaction } =
    UseUpdateMessageReaction();

  const handleSelectEmoji = (emoji: any) => {
    if (!currentUserReaction) {
      handleCreateReaction(emoji.native);
      return;
    }

    if (currentUserReaction?.reaction === emoji.native) {
      handleDeleteReaction();
      return;
    }

    handleUpdateReaction(emoji.native);
  };

  const handleCreateReaction = (reaction: string) => {
    createReaction(
      {
        reaction: reaction,
        messageId: message.id,
        userId: currentUser.id ? currentUser.id : null,
      },
      {
        onSuccess: (data) => {
          // console.log(data);
        },
        onError: (error) => {
          // console.log(error);
        },
      }
    );
  };

  const handleDeleteReaction = () => {
    deleteReaction(
      {
        messageId: message.id,
        userId: currentUser.id ? currentUser.id : null,
      },
      {
        onSuccess: (data) => {
          // console.log(data);
        },
        onError: (error) => {
          // console.log(error);
        },
      }
    );
  };

  const handleUpdateReaction = (reaction: string) => {
    updateReaction(
      {
        reaction: reaction,
        messageId: message.id,
        userId: currentUser.id ? currentUser.id : null,
      },
      {
        onSuccess: (data) => {
          // console.log(data);
        },
        onError: (error) => {
          // console.log(error);
        },
      }
    );
  };

  return (
    <Hint label="React">
      <EmojiPopover
        onEmojiSelect={handleSelectEmoji}
        onOpen={() => setIsMessageHovered(true)}
        onClose={() => setIsMessageHovered(false)}
        initialEmoji={currentUserReaction?.reaction}
      >
        <div className="p-1.5 rounded-full text-gray-600/90 hover:bg-[#c9ccd1]/50 cursor-pointer">
          <BsEmojiSmile className="size-3.5" />
        </div>
      </EmojiPopover>
    </Hint>
  );
};
