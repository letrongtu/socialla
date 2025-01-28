import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useCreatePostModal } from "@/features/posts/store/use-create-post-modal";
import { useFeelingPicker } from "@/features/posts/store/use-feeling-picker";
import { useUploadMediaModal } from "@/features/media-upload/store/use-upload-media-modal";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { FaPhotoVideo } from "react-icons/fa";
import { FaRegFaceGrin } from "react-icons/fa6";
import { RiLiveFill } from "react-icons/ri";

export const CreatePostCard = () => {
  const router = useRouter();
  const { data } = useCurrentUser();

  const [, setOpenCreatePostModal] = useCreatePostModal();
  const [, setOpenFeelingPickerModal] = useFeelingPicker();
  const [, setOpenUploadMedia] = useUploadMediaModal();

  if (!data) {
    return null;
  }

  const { id, firstName, profilePictureUrl } = data;

  const avatarFallback = firstName?.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col bg-[#ffffff] rounded-lg pt-5 px-5 pb-3 space-y-3 shadow-md">
      <div className="flex items-center justify-between space-x-3">
        <button
          onClick={() => {
            router.push(`/profile/${id}`);
          }}
        >
          <Avatar className="rounded size-11 hover:opacity-75 transition">
            <AvatarImage alt={firstName} src={profilePictureUrl} />
            <AvatarFallback className="rounded-full bg-custom-gradient text-white font-semibold text-xl">
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

      <Separator />

      <div className="w-full flex justify-evenly">
        <div className="h-10 w-full flex items-center justify-center ">
          <button
            onClick={() => {}}
            className="w-full rounded-md bg-[#ffffff] hover:bg-[#c9ccd1]/30 flex items-center justify-center space-x-3 py-2"
          >
            <RiLiveFill className="size-7 text-red-500" />

            <p className="text-base text-muted-foreground font-semibold text-black">
              Live
            </p>
          </button>
        </div>

        <div className="h-10 w-full flex items-center justify-center ">
          <button
            onClick={() => {
              setOpenCreatePostModal(true);
              setOpenUploadMedia(true);
            }}
            className="w-full rounded-md bg-[#ffffff] hover:bg-[#c9ccd1]/30 flex items-center justify-center space-x-3 py-2"
          >
            <FaPhotoVideo className="size-7 text-[#06D7A0]" />

            <p className="text-base text-muted-foreground font-semibold text-black">
              Photo/Video
            </p>
          </button>
        </div>

        <div className="h-10 w-full flex items-center justify-center ">
          <button
            onClick={() => {
              setOpenCreatePostModal(true);
              setOpenFeelingPickerModal(true);
            }}
            className="w-full rounded-md bg-[#ffffff] hover:bg-[#c9ccd1]/30 flex items-center justify-center space-x-3 py-2 "
          >
            <FaRegFaceGrin className="size-6 text-[#f78c6a]" />

            <p className="text-base text-muted-foreground font-semibold text-black">
              Feeling
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
