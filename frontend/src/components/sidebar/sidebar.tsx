import { useCurrentUser } from "@/features/auth/api/use-current-user";

import { SidebarButton } from "./sidebar-buton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { MdGroups } from "react-icons/md";
import {
  Gift,
  Loader2,
  MessagesSquare,
  TvMinimalPlay,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

const buttonList = [
  { label: "Friends", icon: UserRound },
  { label: "Groups", icon: MdGroups },
  { label: "Videos", icon: TvMinimalPlay },
  { label: "Birthdays", icon: Gift },
  { label: "Messenger", icon: MessagesSquare },
];
export const Sidebar = () => {
  const router = useRouter();
  const { data, isLoading } = useCurrentUser();

  //TODO: Manage this
  if (isLoading) {
    return (
      <div className="lg:min-w-96 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { id, firstName, lastName, profilePictureUrl } = data;

  const avatarFallback = firstName?.charAt(0).toUpperCase();

  return (
    <div className="hidden lg:flex flex-col lg:min-w-96 ">
      <button
        onClick={() => {
          router.push(`/profile/${id}`);
        }}
        className="w-full pl-3 py-3 flex items-center rounded-lg gap-x-3 hover:bg-[#c9ccd1]/30"
      >
        <Avatar className="rounded size-11 hover:opacity-75 transition">
          <AvatarImage alt={firstName} src={profilePictureUrl} />
          <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        <p className="text-base font-medium">
          {firstName} {lastName}
        </p>
      </button>

      {buttonList.map((button) => (
        <SidebarButton
          key={button.label}
          label={button.label}
          icon={button.icon}
        />
      ))}

      {/*TODO: Add shortcuts -only if the user is in a group */}
      <div className=""></div>
    </div>
  );
};
