import { UserButton } from "@/components/user-button";
import { SearchUserType } from "@/features/search/types";
import { useMessageModal } from "../store/use-message-modal";

interface SearchUserListProps {
  searchedUsers: SearchUserType[];
}
export const SearchUserList = ({ searchedUsers }: SearchUserListProps) => {
  const [, setOpen] = useMessageModal();

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
        <div
          key={index}
          onClick={() => {
            setOpen({ open: true, userId: user.id });
          }}
          className="flex items-center gap-x-3 py-2 px-2 rounded-lg hover:bg-[#c9ccd1]/30 cursor-pointer"
        >
          <UserButton user={user} activeOnClick={false} />
          <p className="text-base font-semibold">{user.fullName}</p>
        </div>
      ))}
    </div>
  );
};
