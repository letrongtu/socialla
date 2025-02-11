import { useEffect, useRef } from "react";
import { UseGetPosts } from "../api/use-get-posts";
import { PostCard } from "./post-card";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

export const PostsDisplaySection = () => {
  const postEndRef = useRef<HTMLDivElement | null>(null);

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();
  const {
    data: posts,
    isLoading: isLoadingPosts,
    canLoadMore,
    loadMore,
  } = UseGetPosts(currentUser?.id ? currentUser.id : null);

  return (
    <div className="flex flex-col space-y-5">
      {posts?.map((post, index) => (
        <PostCard key={index} postData={post} />
      ))}

      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            postEndRef.current = el;

            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );

            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingPosts && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-top border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-4 rounded-full text-xs border border-gray-300 shadow-sm">
            {/**TODO: Create post skeleton */}
            <Loader2 className="size-4 animate-spin" />
          </span>
        </div>
      )}
    </div>
  );
};
