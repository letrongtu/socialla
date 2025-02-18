import { UserButton } from "@/components/user-button";
import { UserType } from "@/features/auth/types";
import { getLastActiveTimeString } from "@/utils/helper";

interface MessageUserInfoCardProps {
  user: UserType;
}

export const MessageUserInfoCard = ({ user }: MessageUserInfoCardProps) => {
  const lastActiveAt = user?.lastActiveAt ? user.lastActiveAt : new Date();

  const createdDisplayString = getLastActiveTimeString(lastActiveAt);

  return (
    <div className="py-10 flex flex-col items-center justify-center gap-y-2">
      <div className="relative flex items-center justify-center">
        <UserButton user={user} activeOnClick={false} size={14} />

        {user.isActive && (
          <div className="absolute -bottom-[0.1rem] -right-[0.1rem] w-4 h-4 flex items-center justify-center rounded-full bg-green-100">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
          </div>
        )}

        {user.lastActiveAt && (
          <div className="absolute -bottom-[0.1rem] -right-[0.4rem] p-[0.1rem] flex items-center justify-center rounded-full bg-green-100">
            <p className="text-xs font-bold text-green-600">
              {createdDisplayString}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <p className="text-[1.1rem] font-semibold">
          {user.firstName} {user.lastName}
        </p>
      </div>
    </div>
  );
};
