import { IconType } from "react-icons/lib";
import { Hint } from "../ui/hint";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessengerButtonProps {
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
  icon: IconType;
}

export const HeaderUtilButton = ({
  label,
  children,
  isActive,
  icon: Icon,
}: MessengerButtonProps) => {
  return (
    <DropdownMenu>
      <Hint label={label}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={() => {}}
            className={cn(
              "flex w-11 h-11 items-center justify-center rounded-full bg-[#c9ccd1]/30 transition-all duration-200",
              isActive && "bg-[#283959]/30"
            )}
          >
            <p>H</p>
          </button>
        </DropdownMenuTrigger>
      </Hint>

      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
};
