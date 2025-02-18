import { useMessageModal } from "../store/use-message-modal";

import { UserType } from "@/features/auth/types";
import { MessageSettingDropdownMenu } from "./message-setting-dropdown-menu/message-setting-dropdown-menu";
import { MessageUserButton } from "./message-user-button";

import { MdClose } from "react-icons/md";
import { FiMinus } from "react-icons/fi";
import { Hint } from "@/components/ui/hint";

interface DisplayMessageModalHeaderProps {
  otherUser: UserType;
}

export const DisplayMessageModalHeader = ({
  otherUser,
}: DisplayMessageModalHeaderProps) => {
  const [, setOpen] = useMessageModal();
  if (!otherUser) {
    return null;
  }

  return (
    <div className="flex justify-between items-center p-1 border-b-[1px] border-[#c9ccd1]/30 shadow-sm">
      <MessageSettingDropdownMenu otherUser={otherUser}>
        <MessageUserButton otherUser={otherUser} />
      </MessageSettingDropdownMenu>

      <div className="flex items-center">
        <Hint label="Minimize chat">
          <div
            onClick={() => {
              setOpen({ open: false, userId: null });
            }}
            className="p-0.5 justify-center items-center rounded-full hover:bg-[#c9ccd1]/50 cursor-pointer"
          >
            <FiMinus className="size-6 text-[#1823ab]" />
          </div>
        </Hint>

        <Hint label="Close chat">
          <div
            onClick={() => {
              setOpen({ open: false, userId: null });
            }}
            className="p-0.5 justify-center items-center rounded-full hover:bg-[#c9ccd1]/50 cursor-pointer"
          >
            <MdClose className="size-6 text-[#1823ab]" />
          </div>
        </Hint>
      </div>
    </div>
  );
};
