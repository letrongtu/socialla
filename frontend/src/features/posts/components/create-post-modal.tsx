import dynamic from "next/dynamic";

const CreatePostEditor = dynamic(
  () => import("@/components/create-post-editor"),
  { ssr: false }
);

import { useRef, useState } from "react";
import Image from "next/image";
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

import { Globe, ImagePlusIcon, X } from "lucide-react";
import { IoCaretDown } from "react-icons/io5";
import { FaPhotoVideo } from "react-icons/fa";
import { Hint } from "@/components/ui/hint";
import { UseMediaLocalUpload } from "@/features/media-upload/api/use-media-local-upload";
import { toast } from "sonner";

export const CreatePostModal = () => {
  const router = useRouter();

  const [open, setOpen] = useCreatePostModal();
  const { data } = useCurrentUser();
  const { localUploadMedia, isPending } = UseMediaLocalUpload();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const imageElementRef = useRef<HTMLInputElement>(null);

  if (!data) {
    return null;
  }

  const { id, firstName, lastName, profilePictureUrl } = data;

  const avatarFallback = firstName?.charAt(0).toUpperCase();
  const placeholder = `What's on your mind, ${firstName}?`;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);

    e.target.value = "";
  };

  const handleSubmit = () => {
    localUploadMedia(
      { files: uploadedFiles, userId: id ? id : "" },
      {
        onSuccess: (response) => {
          console.log(response);
          toast.success("Files uploaded successfully!");
        },
        onError: (error) => {
          toast.error("File upload failed.");
          console.error(error);
        },
        // onError: (error) => {
        //   if (Array.isArray(error.response?.data)) {
        //     const errorMessages = error.response?.data.map(
        //       (error) => error.description
        //     );
        //     setErrorMessages(errorMessages);
        //   } else {
        //     setErrorMessages([error.response?.data as string]);
        //   }
        // },
        // onSettled: () => {
        //   setTimeout(() => {
        //     setErrorMessages(null);
        //   }, 5000);
        // },
      }
    );
  };

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

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="w-full flex flex-col justify-center items-center rounded-lg border"
        >
          <input
            ref={imageElementRef}
            onChange={handleFileSelect}
            type="file"
            multiple
            className="hidden"
          />

          <div className="relative w-full max-w-[calc(100%-1rem)] h-60 m-2 rounded-lg flex flex-col items-center justify-center bg-[#c9ccd1]/30 hover:bg-[#c9ccd1]/60 cursor-pointer">
            {uploadedFiles.length === 0 ? (
              <div
                onClick={() => imageElementRef.current?.click()}
                className="flex flex-col items-center justify-center "
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-1 bg-[#c9ccd1]/70">
                  <ImagePlusIcon className="w-6 h-6 text-black" />
                </div>
                <p className="text-base font-semibold">Add photos/videos</p>
                <p className="text-xs text-muted-foreground">
                  or drag and drop
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                {uploadedFiles.map((file, index) => {
                  const filePreviewUrl = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className="w-full aspect-square overflow-hidden rounded-lg"
                    >
                      <Image
                        fill
                        src={filePreviewUrl}
                        alt={`Uploaded ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div
              onClick={() => {
                setUploadedFiles([]);
              }}
              className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full mb-1 bg-[#c9ccd1]/70 cursor-pointer"
            >
              <X className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        <div className="w-full h-14 flex justify-between items-center rounded-lg border hover:cursor-pointer">
          <p className="text-base font-semibold ml-4">Add to your post</p>
          <div className="flex space-x-2 mr-4">
            <Hint label="Photo/Video">
              <button
                onClick={() => {}}
                className="p-1.5 rounded-md hover:bg-[#c9ccd1]/30"
              >
                <FaPhotoVideo className="size-6 text-green-600" />
              </button>
            </Hint>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full h-10 flex justify-center items-center bg-[#283959] rounded-lg hover:cursor-pointer"
        >
          <p className="text-lg font-semibold text-white">Post</p>
        </button>
      </DialogContent>
    </Dialog>
  );
};
