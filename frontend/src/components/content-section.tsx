import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useCreatePostModal } from "@/features/posts/store/use-create-post-modal";

export const ContentSection = () => {
  const router = useRouter();
  const { data } = useCurrentUser();

  const [_, setOpenCreatePostModal] = useCreatePostModal();

  if (!data) {
    return null;
  }

  const { id, firstName, lastName, profilePictureUrl } = data;

  const avatarFallback = firstName?.charAt(0).toUpperCase();

  return (
    <div className="h-full flex flex-col flex-grow space-y-3 max-w-2xl">
      <div className="flex flex-col bg-[#ffffff] rounded-sm p-5">
        <div className="flex items-center justify-between space-x-3">
          <button
            onClick={() => {
              router.push(`/profile/${id}`);
            }}
          >
            <Avatar className="rounded size-10 hover:opacity-75 transition">
              <AvatarImage alt={firstName} src={profilePictureUrl} />
              <AvatarFallback className="rounded-full bg-[#283959] text-white font-semibold text-lg">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>

          <button
            onClick={() => {
              setOpenCreatePostModal(true);
            }}
            className="w-full bg-[#c9ccd1]/30 h-[2.5rem] rounded-2xl text-start text-muted-foreground hover:bg-slate-100"
          >
            <p className="ml-3">What&apos;s on your mind, {firstName}?</p>
          </button>
        </div>
      </div>
    </div>
  );
};
