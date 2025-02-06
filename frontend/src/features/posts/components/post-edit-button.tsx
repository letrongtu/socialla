import { useState } from "react";
import { usePostCommentModal } from "@/features/post-comments/store/use-post-comment-modal";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Pen, Trash } from "lucide-react";
import { UseDeletePost } from "../api/use-delete-post";
import { FaEllipsis } from "react-icons/fa6";

interface PostEditButtonProps {
  postId: string;
}
export const PostEditButton = ({ postId }: PostEditButtonProps) => {
  const [_, setOpenPostCommentModal] = usePostCommentModal();

  const { mutate, isPending } = UseDeletePost();

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleDeleteComment = () => {
    mutate(
      { id: postId },
      {
        onSuccess: (data) => {
          //   console.log(data);
          setTooltipOpen(false);
          setOpenPostCommentModal({ open: false, postData: null });
        },
        onError: (error) => {
          //   console.log(error);
          setTooltipOpen(false);
        },
      }
    );
  };
  return (
    <TooltipProvider>
      <Tooltip
        open={tooltipOpen}
        onOpenChange={(open) => setTooltipOpen(open)}
        delayDuration={50}
      >
        <TooltipTrigger>
          <div className="flex items-end justify-end p-1 rounded-full hover:bg-[#c9ccd1]/30 cursor-pointer group">
            <FaEllipsis className="size-[1.2rem] text-muted-foreground flex items-end" />
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          className="p-1 w-full flex flex-col items-center justify-center min-w-48"
        >
          {/* <div
            onClick={() => {
              setTooltipOpen(false); // TODO: Change this later
            }}
            className="w-full h-10 flex items-center gap-x-2 px-2 hover:bg-[#1823ab]/10 cursor-pointer group/edit"
          >
            <Pen className="size-3.5 group-hover/edit:text-[#1823ab]" />
            <p className="text-sm font-semibold group-hover/edit:text-[#1823ab]">
              Edit post
            </p>
          </div>

          <Separator /> */}

          <div
            onClick={handleDeleteComment}
            className="w-full h-10 flex items-center gap-x-2 px-2 hover:bg-red-500/10 cursor-pointer group/delete"
          >
            <Trash className="size-3.5 group-hover/delete:text-red-500" />
            <p className="text-sm font-semibold group-hover/delete:text-red-500">
              Delete post
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
