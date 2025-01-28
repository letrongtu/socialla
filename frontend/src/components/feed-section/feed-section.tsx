import { PostsDisplaySection } from "@/features/posts/components/posts-display-section";
import { CreatePostCard } from "./create-post-card";

export const FeedSection = () => {
  return (
    <div className="h-screen max-w-2xl flex flex-col flex-grow space-y-5">
      <CreatePostCard />
      <PostsDisplaySection />
    </div>
  );
};
