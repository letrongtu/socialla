import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { useGetUser } from "@/features/auth/api/use-get-user";
import { reactionsWithEmojiAndIcon } from "./reaction-data/reaction-data";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { FaHeart } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa6";

interface UserReactionCardProps {
  reaction: string;
  userId: string;
}

export const UserReactionCard = ({
  reaction,
  userId,
}: UserReactionCardProps) => {
  const router = useRouter();
  //Should have a global (for the details) loading state for this reaction data
  const { data, isLoading } = useGetUser(userId);

  if (!data) {
    return null;
  }

  const avatarFallback = data.firstName?.charAt(0).toUpperCase();

  const reactionWithEmojiAndIcon = reactionsWithEmojiAndIcon.find(
    (reactionWithEmojiAndIcon) => reactionWithEmojiAndIcon.reaction === reaction
  );

  return (
    <div className="flex flex-row items-center justify-between px-2">
      <div className="flex items-center gap-x-3">
        <button
          onClick={() => {
            router.push(`/profile/${userId}`);
          }}
          className="relative"
        >
          <Avatar className="rounded size-11 hover:opacity-75 transition">
            <AvatarImage alt={data?.firstName} src={data?.profilePictureUrl} />
            <AvatarFallback className="rounded-full bg-[#1823ab] text-white font-semibold text-lg">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div
            className={cn(
              "absolute -bottom-1 -right-1 rounded-full cursor-pointer",
              !reactionWithEmojiAndIcon?.emoji && "p-1",
              reaction === "Love" && "bg-red-500",
              reaction === "Like" && "bg-[#1823ab]"
            )}
          >
            {reaction === "Love" && <FaHeart className="text-white size-2.5" />}

            {reaction === "Like" && (
              <AiFillLike className="text-white size-2.5" />
            )}

            {reactionWithEmojiAndIcon?.emoji && (
              <p className={cn("-mt-[0.1rem] -ml-1 text-[1rem] leading-none")}>
                {reactionWithEmojiAndIcon.emoji}
              </p>
            )}
          </div>
        </button>

        <p className="text-base font-semibold">
          {data.firstName} {data.lastName}
        </p>
      </div>

      <Button className="text-black bg-[#c9ccd1]/50 hover:bg-[#c9ccd1] ">
        <FaUserPlus />
        Add friend
      </Button>
    </div>
  );
};
