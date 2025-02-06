import { ReactionType } from "@/utils/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

import { ReactionDetailsModalDropdownMenu } from "./reaction-details-modal-dropdown-menu";
import { ReactionDetailsHeaderButton } from "./reaction-details-header-button";
import { UserReactionList } from "./user-reaction-list";

interface ReactionDetailsModalProps {
  reactions: ReactionType[];
  currentReaction: string | null;
  setReaction: (reaction: string | null) => void;
}

export const ReactionDetailsModal = ({
  reactions,
  currentReaction,
  setReaction,
}: ReactionDetailsModalProps) => {
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
            <ReactionDetailsHeaderButton
              reactions={reactionsWithOutAll.slice(0, 3)}
              currentReaction={currentReaction}
              setReaction={setReaction}
            />

            {reactions.length >= 3 && (
              <ReactionDetailsModalDropdownMenu
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
