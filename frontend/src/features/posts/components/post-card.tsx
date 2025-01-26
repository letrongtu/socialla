import { useGetUser } from "@/features/auth/api/use-get-user";
import { PostType } from "../types";
import { get } from "http";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  postData: PostType;
}
export const PostCard = ({ postData }: PostCardProps) => {
  const { data: userData, isPending } = useGetUser({ userId: postData.userId });

  if (!userData) {
    return null;
  }

  const avatarFallback = userData?.firstName?.charAt(0).toUpperCase();

  return (
    <div className="w-full bg-[#ffffff] rounded-lg">
      <div className="w-full flex">
        <div className="">
          <Avatar className="rounded size-10 hover:opacity-75 transition">
            <AvatarImage
              alt={userData.firstName}
              src={userData.profilePictureUrl}
            />
            <AvatarFallback className="rounded-full bg-[#283959] text-white font-semibold text-lg">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="text-sm text-gray-500 mt-2">
            {userData.firstName} {userData.lastName}
          </div>
        </div>
      </div>
    </div>
  );
};
