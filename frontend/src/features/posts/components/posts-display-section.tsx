import { UseGetPosts } from "../api/use-get-posts";
import { PostCard } from "./post-card";

export const PostsDisplaySection = () => {
  const { loadMore, data: posts, canLoadMore } = UseGetPosts();

  return (
    <div className="gap-y-5">
      {posts?.map((post, index) => (
        <PostCard key={index} postData={post} />
      ))}
    </div>
  );
};
