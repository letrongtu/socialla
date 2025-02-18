import { UserType } from "@/features/auth/types";
import { getLastActiveTimeString } from "@/utils/helper";

import { UserButton } from "@/components/user-button";
import { ChevronDown } from "lucide-react";

interface MessageUserButtonProps {
  otherUser: UserType;
}

export const MessageUserButton = ({ otherUser }: MessageUserButtonProps) => {
  const lastActiveAt = otherUser.lastActiveAt
    ? otherUser.lastActiveAt
    : new Date();

  const createdDisplayString = getLastActiveTimeString(lastActiveAt);

  return (
    <div className="py-1 px-2 flex items-center gap-x-2 rounded-sm hover:bg-[#c9ccd1]/30 cursor-pointer">
      <div className="relative flex items-center justify-center">
        <UserButton user={otherUser} activeOnClick={false} size={9} />

        {otherUser.isActive && (
          <div className="absolute -bottom-[0.1rem] -right-[0.1rem] w-3.5 h-3.5 flex items-center justify-center rounded-full bg-green-100">
            <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start">
        <p className="text-[0.95rem] font-semibold -mb-[0.1rem]">
          <span>
            {otherUser.firstName} {otherUser.lastName}
          </span>
        </p>
        <p className="text-xs text-muted-foreground -mt-[0.1rem]">
          {otherUser.isActive ? "Active Now" : `${createdDisplayString}`}
        </p>
      </div>

      <div className="flex items-center justify-center">
        <ChevronDown className="size-5 text-[#1823ab]" />
      </div>
    </div>
  );
};
