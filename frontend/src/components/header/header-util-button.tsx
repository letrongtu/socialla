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
import { useGetUnReadNotifications } from "@/features/notifications/api/use-get-unread-notifications";

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
  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();

  const { totalNotifications: totalUnReadNotifications } =
    useGetUnReadNotifications(currentUser?.id ? currentUser.id : null);

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
              "relative flex w-11 h-11 items-center justify-center rounded-full bg-[#c9ccd1]/30 hover:bg-slate-100 transition-all duration-200 group",
              isActive && "bg-[#1823ab]/30"
            )}
          >
            <Icon
              className={cn(
                "w-full text-[#606770] size-6 group-hover:size-7 group-hover:text-[#1823ab]",
                isActive && "text-[#1823ab]"
              )}
            />

            {label === "Notifications" && totalUnReadNotifications > 0 && (
              <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-5 h-5 flex items-center justify-center rounded-full bg-red-500">
                <p className="text-xs font-semibold text-white">
                  {totalUnReadNotifications}
                </p>
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
      </Hint>

      <DropdownMenuContent align={label === "Notifications" ? "end" : "center"}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
