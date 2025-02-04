import { useEffect, useRef, useState } from "react";
import { UseGetCommentsByPostId } from "../api/use-get-comments-by-post-id";

import { CommentCard } from "./comment-card";
import { LazyLoadingCommentCard } from "./lazy-loading/lazy-loading-comment-card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { MdOutlineSort } from "react-icons/md";

interface CommentListProp {
  postId: string;
}
export const CommentList = ({ postId }: CommentListProp) => {
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");

  const {
    data: commentsData,
    isLoading: isLoadingCommentsData,
    loadMore: loadMoreComments,
    canLoadMore: canLoadMoreComments,
  } = UseGetCommentsByPostId(postId, sortBy);

  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative max-w-[42rem] flex flex-col p-4 gap-y-2">
      <div className="pb-2 flex items-center justify-start cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-7 text-black bg-white hover:bg-[#c9ccd1]/30">
              <MdOutlineSort />
              <p className="text-sm font-semibold">Sort By</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem
              onClick={() => setSortBy("top")}
              className="hover:bg-[#c9ccd1]/30 cursor-pointer"
            >
              <p className="text-sm font-semibold">Top comments</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("newest")}
              className="hover:bg-[#c9ccd1]/30 cursor-pointer"
            >
              <p className="text-sm font-semibold">Newest first</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {commentsData.map((comment, index) => (
        <CommentCard key={index} comment={comment} sortBy={sortBy} />
      ))}

      {isLoadingCommentsData && <LazyLoadingCommentCard />}

      <div
        className="absolute bottom-10 left-[50%] h-1"
        ref={(el) => {
          if (el) {
            commentsEndRef.current = el;

            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMoreComments) {
                  loadMoreComments();
                }
              },
              { threshold: 1.0 }
            );

            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />
    </div>
  );
};
