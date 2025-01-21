import dynamic from "next/dynamic";

const CreatePostEditor = dynamic(
  () => import("@/components/create-post-editor"),
  { ssr: false }
);

import { useRouter } from "next/navigation";
import { useCreatePostModal } from "../store/use-create-post-modal";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Globe } from "lucide-react";
import { IoCaretDown } from "react-icons/io5";
import { FaPhotoVideo } from "react-icons/fa";
import { Hint } from "@/components/ui/hint";

export const CreatePostModal = () => {
  const router = useRouter();

  const [open, setOpen] = useCreatePostModal();

  const { data } = useCurrentUser();

  if (!data) {
    return null;
  }

  const { id, firstName, lastName, profilePictureUrl } = data;

  const avatarFallback = firstName?.charAt(0).toUpperCase();
  const placeholder = `What's on your mind, ${firstName}?`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full flex flex-col">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-xl font-semibold">
            Create Post
          </DialogTitle>
        </DialogHeader>

        <Separator className="h-[0.5px]" />
        <div className="flex gap-x-3">
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

          <div className="flex flex-col h-[2.5rem] justify-center">
            <p className="text-lg font-semibold">
              {firstName} {lastName}
            </p>
            {/*TODO: Post audience feature */}
            <button className="py-1 flex items-center justify-center space-x-1 rounded-lg bg-[#c9ccd1]/30 hover:bg-slate-100">
              <Globe className="size-3" />
              <p className="text-xs font-medium">Global</p>
              <IoCaretDown className="size-3" />
            </button>
          </div>
        </div>

        <CreatePostEditor placeholder={placeholder} />

        <div className="w-full h-14 flex justify-between items-center rounded-lg border hover:cursor-pointer">
          <p className="text-base font-semibold ml-4">Add to your post</p>
          <div className="flex space-x-2 mr-4">
            <Hint label="Photo/Video">
              <button className="p-1.5 rounded-md hover:bg-[#c9ccd1]/30">
                <FaPhotoVideo className="size-6 text-green-600" />
              </button>
            </Hint>
          </div>
        </div>

        <div className="w-full h-10 flex justify-center items-center bg-[#283959] rounded-lg hover:cursor-pointer">
          <button className="text-lg font-semibold text-white">Post</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
