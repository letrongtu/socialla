import { SearchUserType } from "@/features/search/types";
import { UserType } from "@/features/auth/types";
import { SearchUserCard } from "./search-user-card";

interface SearchUserListProps {
  searchedUsers: SearchUserType[];
  currentUser: UserType;
}
export const SearchUserList = ({
  searchedUsers,
  currentUser,
}: SearchUserListProps) => {
  if (searchedUsers.length === 0) {
    return (
      <div className="w-full h-11 flex items-center justify-center">
        <p className="font-semibold text-muted-foreground">No user found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {searchedUsers.map((user, index) => (
        <SearchUserCard key={index} user={user} currentUser={currentUser} />
      ))}
    </div>
  );
};
