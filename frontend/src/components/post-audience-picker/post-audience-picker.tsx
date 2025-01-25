import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Separator } from "@/components/ui/separator";

import { Globe } from "lucide-react";
import { FaUserFriends, FaLock } from "react-icons/fa";

export const PostAudiences = [
  {
    visibility: "Friends",
    description: "Your friends on Socialla",
    icon: FaUserFriends,
  },
  {
    visibility: "Global",
    description: "Anyone on or off Socialla",
    icon: Globe,
  },
  { visibility: "Only Me", icon: FaLock },
];

export const DefaultPostAudience = PostAudiences[0].visibility;

interface PostAudiencePickerProps {
  currentPostAudience: string;
  setPostAudience: (currentPostAudience: string) => void;
  openPostAudiencePicker: boolean;
  setOpenPostAudiencePicker: (openPostAudiencePicker: boolean) => void;
}

export const PostAudiencePicker = ({
  currentPostAudience,
  setPostAudience,
  openPostAudiencePicker,
  setOpenPostAudiencePicker,
}: PostAudiencePickerProps) => {
  return (
    <Dialog
      open={openPostAudiencePicker}
      onOpenChange={setOpenPostAudiencePicker}
    >
      <DialogContent
        showCloseButton={false}
        showOverlayBackground={false}
        className="w-full"
      >
        <DialogHeader className="relative flex flex-row items-center justify-center">
          <DialogClose asChild>
            <div
              onClick={() => {
                setOpenPostAudiencePicker(false);
              }}
              className="absolute top-0 left-0 w-8 h-8 flex justify-center items-center rounded-full bg-[#c9ccd1] hover:bg-[#c9ccd1]/50 cursor-pointer"
            >
              <IoIosArrowRoundBack className="size-6" />
            </div>
          </DialogClose>

          <DialogTitle className="h-full text-xl font-semibold">
            Post audience
          </DialogTitle>
        </DialogHeader>

        <Separator className="h-[0.5px]" />

        <div className="flex flex-col space-y-5 items-center justify-center max-h-[30rem] gap-y-2 px-2 cursor-pointer">
          <div className="flex flex-col justify-center gap-y-1">
            <p className="text-base font-semibold">Who can see your post?</p>
            <p className="text-sm text-muted-foreground">
              Your post will show up in Feed, on your profile and in search
              results.
            </p>
            <p className="text-sm text-muted-foreground">
              Your default audience is set to Friends, but you can change the
              audience of this specific post.
            </p>
          </div>
          <div className="w-full">
            {PostAudiences.map(
              ({ visibility, description, icon: Icon }, index) => (
                <div
                  onClick={() => {
                    setPostAudience(visibility);
                  }}
                  key={index}
                  className="w-full h-16 flex items-center justify-between hover:bg-[#c9ccd1]/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-x-5">
                    <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#c9ccd1]/50">
                      <Icon className="size-5" />
                    </div>

                    <div className="flex flex-col justify-center">
                      <p className="text-base font-semibold">{visibility}</p>
                      {description && (
                        <p className="text-sm font-thin text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-[1px] border-black flex justify-center items-center",
                      currentPostAudience === visibility && "border-blue-600 "
                    )}
                  >
                    {currentPostAudience === visibility && (
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
