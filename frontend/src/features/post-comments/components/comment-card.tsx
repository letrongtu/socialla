import { cn } from "@/lib/utils";
import { useState } from "react";

import { CommentType } from "../types";
import CommentEditor from "./editor/comment-editor";
import UpdateCommentEditor from "./editor/update-comment-editor";
import { useGetUser } from "@/features/auth/api/use-get-user";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { UseGetCommentsByParentCommentId } from "../api/use-get-comments-by-parent-comment-id";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentEngagementBar } from "./comment-engagement-bar";

import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { UserHoverCard } from "@/components/user-hover-card";

interface CommentCardProps {
  comment: CommentType;
  sortBy: string;
  setParentIsReply?: (isReply: boolean) => void;
  setIsLastChildEditingFromParent?: (isLastChildEditing: boolean) => void;
  isLastChild?: boolean;
}

export const CommentCard = ({
  comment,
  sortBy,
  setParentIsReply,
  setIsLastChildEditingFromParent,
  isLastChild = false,
}: CommentCardProps) => {
  const { data: currentUserData, isLoading: isLoadingCurrentUserData } =
    useCurrentUser();
  const { data: createdCommentUser, isLoading: isLoadingCreatedCommentUser } =
    useGetUser(comment.userId);

  const {
    data: replyComments,
    isLoading: isLoadingReplyComments,
    loadMore: loadMoreReplyComments,
    canLoadMore: canLoadMoreReplyComments,
    totalReplyComments: totalReplyCommentsCount,
    remainingCommentsCount: remainingReplyCommentsCount,
  } = UseGetCommentsByParentCommentId(comment.id, sortBy);

  const [isReply, setIsReply] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [isEditComment, setIsEditComment] = useState(false);
  const [isLastChildEditing, setIsLastChildEditing] = useState(false);

  if (!createdCommentUser || !currentUserData) {
    return null;
  }

  const avatarFallback = createdCommentUser.firstName?.charAt(0).toUpperCase();

  return (
    <div className="relative w-full flex flex-row justify-between gap-x-2 group/comment">
      <div className="cursor-pointer">
        <UserHoverCard user={createdCommentUser} currentUser={currentUserData}>
          <Avatar className="rounded size-10 hover:opacity-75 transition">
            <AvatarImage
              alt={createdCommentUser.firstName}
              src={createdCommentUser.profilePictureUrl}
            />
            <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-lg">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </UserHoverCard>
      </div>

      <div className="max-w-[calc(100%-3rem)] flex flex-col flex-grow">
        {isEditComment ? (
          <UpdateCommentEditor
            commentId={comment.id}
            defaultContent={comment.content}
            isEditComment={isEditComment}
            setIsEditComment={setIsEditComment}
            setIsLastChildEditingFromParent={setIsLastChildEditingFromParent}
            isLastChild={isLastChild}
          />
        ) : (
          <div className="w-fit max-w-full min-w-28 px-3 py-1 rounded-xl bg-[#c9ccd1]/30">
            <UserHoverCard
              user={createdCommentUser}
              currentUser={currentUserData}
            >
              <p className="text-sm font-semibold hover:underline cursor-pointer">
                {createdCommentUser.firstName} {createdCommentUser.lastName}
              </p>
            </UserHoverCard>

            <div className="break-words">
              {comment.content?.map((line, idx) => (
                <p key={idx} className="text-sm break-words">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        <CommentEngagementBar
          comment={comment}
          isEditComment={isEditComment}
          setIsReply={setParentIsReply ? setParentIsReply : setIsReply}
          setIsEditComment={setIsEditComment}
          setIsLastChildEditingFromParent={setIsLastChildEditingFromParent}
          isLastChild={isLastChild}
        />

        {totalReplyCommentsCount > 0 && (
          <div
            onClick={() => {
              setShowReply((prev) => !prev);
            }}
            className="pl-3 pr-4 py-1 rounded-lg w-fit flex items-center gap-x-1 text-[#1823ab] cursor-pointer hover:bg-[#c9ccd1]/30"
          >
            {showReply ? (
              <FaChevronUp className="text-sm" />
            ) : (
              <FaChevronDown className="text-sm" />
            )}
            <p className="text-sm  font-semibold">
              {totalReplyCommentsCount}{" "}
              {replyComments.length === 1 ? "reply" : "replies"}
            </p>
          </div>
        )}

        {showReply && (
          <div className="flex flex-col pt-1.5 gap-y-2">
            {replyComments.map((comment, index) => (
              <CommentCard
                key={index}
                comment={comment}
                sortBy={sortBy}
                setParentIsReply={setIsReply}
                setIsLastChildEditingFromParent={setIsLastChildEditing}
                isLastChild={index === replyComments.length - 1}
              />
            ))}
          </div>
        )}

        {showReply && remainingReplyCommentsCount > 0 && (
          <div
            onClick={() => {
              if (canLoadMoreReplyComments) {
                loadMoreReplyComments();
              }
            }}
            className="pl-3 pr-4 py-1 rounded-lg w-fit flex items-center gap-x-1 text-[#1823ab] cursor-pointer hover:bg-[#c9ccd1]/30"
          >
            <MdOutlineSubdirectoryArrowRight />
            <p className="text-sm  font-semibold">Show more replies</p>
          </div>
        )}

        {isReply && !setParentIsReply && (
          <div className="py-2">
            <CommentEditor
              postId={comment.postId}
              userId={comment.userId}
              parentCommentId={comment.id}
              isReply={isReply}
              setIsReply={setIsReply}
              setShowReply={setShowReply}
              replyEditor
            />
          </div>
        )}

        {/** CONNECTION LINE LOGIC HERE */}

        {/** Curve line for editor */}
        {isReply && (
          <div className="absolute bottom-[4.8rem] left-[1.2rem] w-6 h-10 rounded-bl-xl border-b-[2px] border-l-[2px] border-[#c9ccd1]/70" />
        )}
        {/** Horizontaline for editor */}
        {isReply && (
          <div
            className={cn(
              "absolute top-[2.8rem] left-[1.2rem] w-[2px] bg-[#c9ccd1]/70"
            )}
            style={{
              height: "calc(100% - 10rem)",
            }}
          />
        )}

        {/** Curve line for reply comment when not editing comment */}
        {setParentIsReply && !isEditComment && (
          <div className="absolute bottom-[3.2rem] -left-[1.8rem] w-6 h-10 rounded-bl-xl border-b-[2px] border-l-[2px] border-[#c9ccd1]/70" />
        )}

        {/** Curve line for reply comment when editing comment */}
        {setParentIsReply && isEditComment && (
          <div className="absolute bottom-[5.95rem] -left-[1.8rem] w-6 h-10 rounded-bl-xl border-b-[2px] border-l-[2px] border-[#c9ccd1]/70" />
        )}

        {/* * Horizontaline when editor is close */}
        {showReply && (
          <div
            className={cn(
              "absolute top-[2.8rem] left-[1.2rem] w-[2px] bg-[#c9ccd1]/70"
            )}
            style={{
              height: isLastChildEditing
                ? "calc(100% - 11rem)"
                : "calc(100% - 8.5rem)",
            }}
          />
        )}
      </div>
    </div>
  );
};
