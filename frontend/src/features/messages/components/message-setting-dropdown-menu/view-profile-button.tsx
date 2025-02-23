import { useRouter } from "next/navigation";

import { UserType } from "@/features/auth/types";

import { PiUserCircle } from "react-icons/pi";

interface ViewProfileButtonProps {
  user: UserType;
}

export const ViewProfileButton = ({ user }: ViewProfileButtonProps) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/profile/${user.id}`)}
      className="px-2 w-full h-10 flex justify-start items-center space-x-2 hover:text-[#1823ab] hover:bg-[#1823ab]/15 rounded-md cursor-pointer"
    >
      <div className="py-1 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
        <PiUserCircle className="size-6" />
      </div>

      <p className="text-sm font-semibold">View Profile</p>
    </div>
  );
};
