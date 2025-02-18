import { UserType } from "@/features/auth/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewProfileButton } from "./view-profile-button";
import { ChangeEmojiButton } from "./change-emoji-button";
import { ChangeNicknameButton } from "./change-nickname-button";
import { DeleteChatButton } from "./delete-chat-button";

import { RiListSettingsLine } from "react-icons/ri";

interface MessageSettingDropdownMenuProps {
  otherUser: UserType;
  children: React.ReactNode;
}

export const MessageSettingDropdownMenu = ({
  otherUser,
  children,
}: MessageSettingDropdownMenuProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start" className="lg:w-72 p-0">
        <DropdownMenuLabel className="h-11 flex items-center gap-x-0.5">
          <p className="text-base px-2">Message Settings</p>
          <RiListSettingsLine className="size-4" />
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#c9ccd1]/70 my-0" />

        <div className="flex flex-col p-2">
          <ViewProfileButton user={otherUser} />

          <DropdownMenuSeparator className="bg-[#c9ccd1]/70 my-2" />

          <ChangeEmojiButton user={otherUser} />
          <ChangeNicknameButton user={otherUser} />

          <DropdownMenuSeparator className="bg-[#c9ccd1]/70 my-2" />

          <DeleteChatButton user={otherUser} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
