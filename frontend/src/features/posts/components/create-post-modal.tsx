import dynamic from "next/dynamic";

const CreatePostEditor = dynamic(
  () => import("@/components/create-post-editor"),
  { ssr: false }
);

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePostModal } from "../store/use-create-post-modal";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { UseMediaLocalUpload } from "@/features/media-upload/api/use-media-local-upload";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { MediaUploadInput } from "@/components/media-upload/media-upload-input";

import { Globe } from "lucide-react";
import { IoCaretDown } from "react-icons/io5";
import { FaPhotoVideo } from "react-icons/fa";

export const CreatePostModal = () => {
  const router = useRouter();

  const { data } = useCurrentUser();
  const { localUploadMedia, isPending } = UseMediaLocalUpload();
  const [openCreatePostModal, setOpenCreatePostModal] = useCreatePostModal();

  const [openUploadMedia, setOpenUploadMedia] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  if (!data) {
    return null;
  }

  const { id, firstName, lastName, profilePictureUrl } = data;

  const avatarFallback = firstName?.charAt(0).toUpperCase();
  const placeholder = `What's on your mind, ${firstName}?`;

  const handleMediaUpload = () => {
    localUploadMedia(
      { files: uploadedFiles, userId: id ? id : "" },
      {
        onSuccess: (response) => {
          console.log(response);
          handlePostSuccess();
          toast.success(response?.message);
        },
        onError: (error) => {
          toast.error((error.response?.data as string) || error.message);
        },
      }
    );
  };

  const handlePostSuccess = () => {
    setUploadedFiles([]);
    setOpenCreatePostModal(false);
  };

  return (
    <Dialog open={openCreatePostModal} onOpenChange={setOpenCreatePostModal}>
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

        {openUploadMedia && (
          <MediaUploadInput
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            setOpenUploadMedia={setOpenUploadMedia}
          />
        )}

        <div className="w-full h-14 flex justify-between items-center rounded-lg border hover:cursor-pointer">
          <p className="text-base font-semibold ml-4">Add to your post</p>
          <div className="flex space-x-2 mr-4">
            <Hint label="Photo/Video">
              <button
                onClick={() => {
                  setOpenUploadMedia(true);
                }}
                className="p-1.5 rounded-md hover:bg-[#c9ccd1]/30"
              >
                <FaPhotoVideo className="size-6 text-green-600" />
              </button>
            </Hint>
          </div>
        </div>

        <Button
          onClick={handleMediaUpload}
          disabled={isPending}
          className="w-full h-10 flex justify-center items-center bg-[#283959] rounded-lg hover:cursor-pointer hover:bg-[#283959]/80"
        >
          <p className="text-lg font-semibold text-white">Post</p>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
