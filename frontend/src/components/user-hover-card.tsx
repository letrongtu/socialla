import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UserButton } from "./user-button";
import { AddFriendButton } from "@/features/friendships/components/add-friend-button";
import { Button } from "./ui/button";

import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdDynamicFeed } from "react-icons/md";
import { BiSolidMessageSquareDetail } from "react-icons/bi";

interface UserHoverCardProps {
  user: {
    id: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    dateOfBirth: Date | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    profilePictureUrl: string | undefined;
    createdAt: Date | undefined;
  };
  currentUser: {
    id: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    dateOfBirth: Date | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    profilePictureUrl: string | undefined;
    createdAt: Date | undefined;
  };

  children: React.ReactNode;
}

export const UserHoverCard = ({
  user,
  currentUser,
  children,
}: UserHoverCardProps) => {
  if (!user.id || !currentUser.id) {
    return null;
  }

  const isCurrentUser = user.id === currentUser.id;

  return (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="w-fit lg:min-w-96">
        <div className="flex flex-col gap-y-3 justify-start items-start">
          <div className="flex gap-x-3 justify-center">
            <UserButton user={user} />
            <div className="flex flex-col gap-y-2">
              <p className="text-lg text-black font-semibold hover:underline cursor-pointer">
                {user.firstName} {user.lastName}
              </p>

              {user.phoneNumber && (
                <div className="flex items-center gap-x-3">
                  <FaPhoneAlt className="size-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">
                    {user.phoneNumber}0420854744
                  </p>
                </div>
              )}

              {user.email && (
                <div
                  onClick={() => {}}
                  className="flex items-center gap-x-3 cursor-pointer group/email"
                >
                  <MdEmail className="size-4 text-muted-foreground" />
                  <p className="text-sm font-semibold group-hover/email:underline">
                    {user.email}
                  </p>
                </div>
              )}

              {true && (
                <div className="flex items-center gap-x-2">
                  <MdDynamicFeed className="size-5 text-muted-foreground" />
                  <p className="text-sm font-semibold hover:underline">
                    768 Followers
                  </p>
                </div>
              )}
            </div>
          </div>

          {!isCurrentUser && (
            <div className="w-full flex items-center justify-center gap-x-2">
              <Button
                onClick={() => {}}
                className="w-full py-2 px-4 flex items-center justify-center gap-x-2 rounded-md text-black bg-[#c9ccd1]/30 hover:bg-[#c9ccd1]/70 cursor-pointer"
              >
                <BiSolidMessageSquareDetail className="size-5" />
                <p className="text-sm font-semibold">Message</p>
              </Button>

              <AddFriendButton
                currentUserId={currentUser.id}
                otherUserId={user.id}
              />
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
