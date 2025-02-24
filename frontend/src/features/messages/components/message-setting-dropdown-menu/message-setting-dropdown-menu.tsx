import { UserType } from "@/features/auth/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewProfileButton } from "./view-profile-button";
import { ChangeEmojiButton } from "../../../conversations/components/chat-setting-buttons/change-emoji-button";
import { ChangeNicknameButton } from "@/features/conversations/components/chat-setting-buttons/change-nickname-button";
import { DeleteChatButton } from "@/features/conversations/components/chat-setting-buttons/delete-chat-button";

import { RiListSettingsLine } from "react-icons/ri";
import { useMessageModal } from "../../store/use-message-modal";

interface MessageSettingDropdownMenuProps {
  otherUser: UserType;
  currentUser: UserType;
  children: React.ReactNode;
}

export const MessageSettingDropdownMenu = ({
  otherUser,
  currentUser,
  children,
}: MessageSettingDropdownMenuProps) => {
  const [{ conversationId }] = useMessageModal();

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

          {/*
          //TODO: Enable this later
          <ChangeEmojiButton user={otherUser} />
          <ChangeNicknameButton user={otherUser} /> */}

          {/* <DropdownMenuSeparator className="bg-[#c9ccd1]/70 my-2" /> */}

          <DeleteChatButton
            user={currentUser}
            conversationId={conversationId}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
