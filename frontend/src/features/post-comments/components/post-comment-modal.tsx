import { useEffect } from "react";

import { usePostCommentModal } from "../store/use-post-comment-modal";
import { useGetUser } from "@/features/auth/api/use-get-user";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import CommentEditor from "./editor/comment-editor";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostCard } from "@/features/posts/components/post-card";
import { Separator } from "@/components/ui/separator";

import { IoClose } from "react-icons/io5";
import { CommentList } from "./comment-list";

export const PostCommentModal = () => {
  const [{ open, postData }, setOpenPostCommentModal] = usePostCommentModal();

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();

  const { data, isLoading } = useGetUser(
    postData?.userId
      ? postData.userId
      : currentUser?.id
      ? currentUser.id
      : "edge-case-that-never-happen"
  );

  if (
    !data ||
    !data.id ||
    !postData ||
    !postData.id ||
    !currentUser ||
    !currentUser.id
  ) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() =>
        setOpenPostCommentModal({ open: false, postData: null })
      }
    >
      <DialogOverlay />

      <DialogContent
        showCloseButton={false}
        className="max-w-[42rem] max-h-[calc(100%-5rem)] flex flex-col gap-0 px-0 pb-0 pt-4 m-0 left-[50.1%]"
      >
        <DialogHeader className="relative flex items-center pb-4 justify-center">
          <DialogTitle className="flex flex-row text-xl font-semibold">
            {data.firstName} {data.lastName}&apos;s Post
          </DialogTitle>

          <DialogClose className="bg-[#c9ccd1] w-8 h-8 absolute right-4 -top-2 rounded-full opacity-70 flex items-center justify-center hover:bg-[#c9ccd1]/70">
            <IoClose className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <Separator />

        <div className="w-full overflow-y-auto custom-scrollbar">
          {postData && postData.fileUrls && (
            <PostCard postData={postData} shadow={false} />
          )}
          <Separator />

          <CommentList postId={postData.id} />
        </div>

        <CommentEditor postId={postData.id} userId={currentUser.id} />
      </DialogContent>
    </Dialog>
  );
};
