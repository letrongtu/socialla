import { useRouter } from "next/navigation";
import { UserButton } from "@/components/user-button";
import { SearchUserType } from "../types";

interface SearchResultUserCardProps {
  user: SearchUserType;
}
export const SearchResultUserCard = ({ user }: SearchResultUserCardProps) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(`/profile/${user.id}`);
      }}
      className="flex items-center gap-x-3 py-2 px-4 rounded-lg hover:bg-[#c9ccd1]/30 cursor-pointer"
    >
      <UserButton user={user} />
      <div className="flex flex-col">
        <p className="text-base font-semibold">{user.fullName}</p>
        {user.isFriend && (
          <p className="text-sm font-semibold text-muted-foreground">Friend</p>
        )}

        {!user.isFriend && user.mutualFriendsCount === 0 && (
          <p className="text-sm font-semibold text-muted-foreground">People</p>
        )}

        {!user.isFriend && user.mutualFriendsCount > 0 && (
          <p className="text-sm font-semibold text-muted-foreground">
            {user.mutualFriendsCount} mutual{" "}
            {user.mutualFriendsCount > 1 ? "friends" : "friend"}
          </p>
        )}
      </div>
    </div>
  );
};
