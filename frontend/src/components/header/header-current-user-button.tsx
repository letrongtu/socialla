import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Hint } from "../ui/hint";
import { deleteCookie } from "cookies-next";

import { useCurrentUser } from "@/features/auth/api/use-current-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { ChevronDown, LogOut, Moon } from "lucide-react";

interface HeaderCurrentUserButtonProps {
  setCurrentUtilButton?: (currentUtilButton: string | null) => void;
}
export const HeaderCurrentUserButton = ({
  setCurrentUtilButton,
}: HeaderCurrentUserButtonProps) => {
  const router = useRouter();

  const { data } = useCurrentUser();
  if (!data) {
    return null;
  }

  const { id, firstName, lastName, profilePictureUrl } = data;

  const avatarFallback = firstName?.charAt(0).toUpperCase();

  const signOut = () => {
    deleteCookie("token");
    deleteCookie("userId");
    toast.success("Logout successfully");
    router.replace("/");
  };

  return (
    <DropdownMenu
      modal={false}
      onOpenChange={() => {
        if (setCurrentUtilButton) {
          setCurrentUtilButton(null);
        }
      }}
    >
      <Hint label="Account">
        <DropdownMenuTrigger asChild>
          <div className="relative hover:cursor-pointer">
            <Avatar className="rounded size-10 hover:opacity-75 transition">
              <AvatarImage alt={firstName} src={profilePictureUrl} />
              <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-lg">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="absolute right-2.5 bottom-2.5 w-1 h-1">
              <div className="w-full h-full ">
                <ChevronDown className="size-4 bg-[#ffffff] rounded-full text-" />
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
      </Hint>

      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-80 bg-[#ffffff] space-y-1 rounded-lg"
      >
        <DropdownMenuItem
          onClick={() => {
            router.push(`/profile/${id}`);
          }}
          className="text-md m-2 mb-4 font-semibold cursor-pointer rounded-lg bg-[#ffffff] shadow-md shadow-slate-300"
        >
          <div className="w-full h-full py-3 px-3 flex items-center rounded-lg gap-x-3 hover:bg-[#c9ccd1]/30">
            <div className="flex">
              <Avatar className="rounded size-10 hover:opacity-75 transition">
                <AvatarImage alt={firstName} src={profilePictureUrl} />
                <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-lg">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xl font-semibold">
              {firstName} {lastName}
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {}}
          className="h-12 text-md font-semibold cursor-pointer hover:bg-[#c9ccd1]/30 group/display"
        >
          <div className="flex justify-center items-center w-8 h-8 rounded-full bg-[#c9ccd1] mr-1 ">
            <Moon className="text-[#606770] size-4 group-hover/display:size-5 group-hover/display:text-[#1823ab]" />
          </div>
          Display
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut()}
          className="h-12 text-md font-semibold cursor-pointer hover:bg-[#c9ccd1]/30 group/logout"
        >
          <div className="flex justify-center items-center w-8 h-8 rounded-full bg-[#c9ccd1] mr-1">
            <LogOut className="text-[#606770] size-4 group-hover/logout:size-5 group-hover/logout:text-[#1823ab]" />
          </div>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
