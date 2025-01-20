import { useState } from "react";
import { IconType } from "react-icons/lib";
import { Hint } from "../ui/hint";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

interface HeaderUtilButtonProps {
  label: string;
  children: React.ReactNode;
  currentButton: string | null;
  setCurrentButton: (currentButton: string | null) => void;
  isActive?: boolean;
  icon: IconType;
}

export const HeaderUtilButton = ({
  label,
  children,
  currentButton,
  setCurrentButton,
  isActive,
  icon: Icon,
}: HeaderUtilButtonProps) => {
  const isOpen = currentButton === label;

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => setCurrentButton(open ? label : null)}
    >
      <Hint label={label}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={() => setCurrentButton(isOpen ? null : label)}
            className={cn(
              "flex w-11 h-11 items-center justify-center rounded-full bg-[#c9ccd1]/30 transition-all duration-200",
              isActive && "bg-[#283959]/30"
            )}
          >
            <Icon
              className={cn(
                "w-full text-black size-6",
                isActive && "text-[#283959]"
              )}
            />
          </button>
        </DropdownMenuTrigger>
      </Hint>

      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
};
