import { ReactionType } from "@/utils/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

import { MessageReactionDetailsHeaderButton } from "./message-reaction-details-header-button";
import { MessageReactionDetailsModalDropdownMenu } from "./message-reaction-details-modal-dropdown-menu";
import { UserReactionList } from "@/components/reaction-details-modal/user-reaction-list";

interface MessageReactionDetailsModalProps {
  reactions: ReactionType[];
  currentReaction: string | null;
  setReaction: (reaction: string | null) => void;
}

export const MessageReactionDetailsModal = ({
  reactions,
  currentReaction,
  setReaction,
}: MessageReactionDetailsModalProps) => {
  const reactionsWithOutAll = reactions.filter(
    (reaction) => reaction.reaction !== "All"
  );
  return (
    <Dialog
      open={currentReaction !== null}
      onOpenChange={() => setReaction(null)}
    >
      <DialogOverlay />

      <DialogContent showCloseButton={false} className="p-4 flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex flex-row text-xl font-semibold">
            <MessageReactionDetailsHeaderButton
              reactions={reactionsWithOutAll.slice(0, 3)}
              currentReaction={currentReaction}
              setReaction={setReaction}
            />

            {reactions.length > 3 && (
              <MessageReactionDetailsModalDropdownMenu
                reactions={reactionsWithOutAll.slice(3)}
                currentReaction={currentReaction}
                setReaction={setReaction}
              />
            )}
          </DialogTitle>
        </DialogHeader>

        <UserReactionList
          reactions={reactions}
          currentReaction={currentReaction}
        />
      </DialogContent>
    </Dialog>
  );
};
