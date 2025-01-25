import dynamic from "next/dynamic";

const CreatePostEditor = dynamic(
  () => import("@/components/create-post-editor"),
  { ssr: false }
);

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useCreatePostModal } from "../store/use-create-post-modal";
import { UseMediaLocalUpload } from "@/features/media-upload/api/use-media-local-upload";
import { FeelingType, FeelingPicker } from "./feeling-picker";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { MediaUploadInput } from "@/components/media-upload/media-upload-input";

import { FaPhotoVideo } from "react-icons/fa";
import { FaRegFaceGrin } from "react-icons/fa6";
import { PostAudienceTrigger } from "@/components/post-audience-picker/post-audience-trigger";
import {
  DefaultPostAudience,
  PostAudiences,
  PostAudiencePicker,
} from "@/components/post-audience-picker/post-audience-picker";

export const CreatePostModal = () => {
  const router = useRouter();

  const { data } = useCurrentUser();
  const { localUploadMedia, isPending } = UseMediaLocalUpload();
  const [openCreatePostModal, setOpenCreatePostModal] = useCreatePostModal();

  const [openPostAudiencePicker, setOpenPostAudiencePicker] = useState(false);
  const [openFeelingPickerModal, setOpenFeelingPickerModal] = useState(false);
  const [openUploadMedia, setOpenUploadMedia] = useState(false);

  const [postContent, setPostContent] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentFeeling, setCurrentFeeling] = useState<FeelingType | null>(
    null
  );
  const [postAudience, setPostAudience] = useState(DefaultPostAudience);

  //current user data
  if (!data) {
    return null;
  }

  const { id: userId, firstName, lastName, profilePictureUrl } = data;

  const avatarFallback = firstName?.charAt(0).toUpperCase();
  const placeholder = `What's on your mind, ${firstName}?`;

  //post audience
  const currentAudience =
    PostAudiences.find((audience) => audience.visibility === postAudience) ||
    PostAudiences[0];

  //request
  const handleMediaUpload = () => {
    localUploadMedia(
      { files: uploadedFiles, userId: userId ? userId : "" },
      {
        onSuccess: (response) => {
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
    setPostContent([]);
    setPostAudience(DefaultPostAudience);
  };

  return (
    <>
      {openCreatePostModal && (
        <Dialog
          open={openCreatePostModal}
          onOpenChange={setOpenCreatePostModal}
        >
          <DialogOverlay />

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
                  router.push(`/profile/${userId}`);
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
                <p className="text-base font-semibold">
                  {firstName} {lastName}{" "}
                  {currentFeeling && (
                    <span className="text-sm font-medium">
                      is {currentFeeling.emoji} feeling {currentFeeling.feeling}
                    </span>
                  )}
                </p>

                <PostAudienceTrigger
                  label={currentAudience.visibility}
                  icon={currentAudience.icon}
                  setOpenPostAudiencePicker={setOpenPostAudiencePicker}
                />
              </div>
            </div>

            <CreatePostEditor
              setPostContent={setPostContent}
              placeholder={placeholder}
            />

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
                    <FaPhotoVideo className="size-6 text-[#06D7A0]" />
                  </button>
                </Hint>

                <Hint label="Feeling">
                  <button
                    onClick={() => {
                      setOpenFeelingPickerModal(true);
                    }}
                    className="p-1.5 rounded-md hover:bg-[#c9ccd1]/30"
                  >
                    <FaRegFaceGrin className="size-6 text-[#f78c6a]" />
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
      )}

      {openFeelingPickerModal && (
        <FeelingPicker
          openFeelingPickerModal={openFeelingPickerModal}
          setOpenFeelingPickerModal={setOpenFeelingPickerModal}
          currentFeeling={currentFeeling}
          setCurrentFeeling={setCurrentFeeling}
        />
      )}

      {openPostAudiencePicker && (
        <PostAudiencePicker
          currentPostAudience={postAudience}
          setPostAudience={setPostAudience}
          openPostAudiencePicker={openPostAudiencePicker}
          setOpenPostAudiencePicker={setOpenPostAudiencePicker}
        />
      )}
    </>
  );
};
