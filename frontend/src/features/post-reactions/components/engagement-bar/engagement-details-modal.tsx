import { PostReactionType } from "../../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

import { EngagementDetailsModalDropdownMenu } from "./engagement-details-modal-dropdown-menu";
import { EngagementDetailsHeaderButton } from "./engagement-details-header-button";
import { UserReactionList } from "./user-reaction-list";

interface EngagementDetailsModalProps {
  postReactions: PostReactionType[];
  currentReaction: string | null;
  setReaction: (reaction: string | null) => void;
}

export const EngagementDetailsModal = ({
  postReactions,
  currentReaction,
  setReaction,
}: EngagementDetailsModalProps) => {
  const postReactionsWithOutAll = postReactions.filter(
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
            <EngagementDetailsHeaderButton
              postReactions={postReactionsWithOutAll.slice(0, 3)}
              currentReaction={currentReaction}
              setReaction={setReaction}
            />

            {postReactions.length >= 3 && (
              <EngagementDetailsModalDropdownMenu
                postReactions={postReactionsWithOutAll.slice(3)}
                currentReaction={currentReaction}
                setReaction={setReaction}
              />
            )}
          </DialogTitle>
        </DialogHeader>

        <UserReactionList
          postReactions={postReactions}
          currentReaction={currentReaction}
        />
      </DialogContent>
    </Dialog>
  );
};
