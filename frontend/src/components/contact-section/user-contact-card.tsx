import { useGetUser } from "@/features/auth/api/use-get-user";

import { UserButton } from "../user-button";
import { UserType } from "@/features/auth/types";
import { getLastActiveTimeString } from "@/utils/helper";
import { useMessageModal } from "@/features/messages/store/use-message-modal";

interface UserContactCardProps {
  userId: string;
  currentUser: UserType;
}
export const UserContactCard = ({
  userId,
  currentUser,
}: UserContactCardProps) => {
  const [, setOpen] = useMessageModal();

  const { data: user, isLoading: isLoadingUser } = useGetUser(userId);

  if (!user) {
    return null;
  }

  const lastActiveAt = user?.lastActiveAt ? user.lastActiveAt : new Date();

  const createdDisplayString = getLastActiveTimeString(lastActiveAt);

  return (
    <div
      onClick={() => {
        setOpen((prev) => {
          if (prev.open && prev.userId) {
            return { open: false, userId: null };
          } else {
            return { open: true, userId: user.id ? user.id : null };
          }
        });
      }}
      className=" w-full p-2 flex items-center justify-start gap-x-2 hover:bg-[#c9ccd1]/30 rounded-md cursor-pointer"
    >
      <div className="relative flex items-center justify-center">
        <UserButton user={user} activeOnClick={false} />

        {user.isActive && (
          <div className="absolute -bottom-[0.1rem] -right-[0.1rem] w-3.5 h-3.5 flex items-center justify-center rounded-full bg-green-100">
            <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
          </div>
        )}

        {user.lastActiveAt && (
          <div className="absolute -bottom-[0.1rem] -right-[0.4rem] p-[0.1rem] flex items-center justify-center rounded-full bg-green-100">
            <p className="text-[0.65rem] font-bold text-green-600">
              {createdDisplayString}
            </p>
          </div>
        )}
      </div>

      <p className="text-base font-semibold ">
        {user?.firstName} {user?.lastName}
      </p>
    </div>
  );
};
