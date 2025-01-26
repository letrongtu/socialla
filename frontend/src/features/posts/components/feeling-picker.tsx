import { cn } from "@/lib/utils";

import emojiData from "unicode-emoji-json";
import { feelingsData } from "./feeling-data/feeling-data";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { useFeelingPicker } from "../store/use-feeling-picker";

export type FeelingType = {
  feeling: string;
  emoji: string | null;
};

interface FeelingPickerProps {
  currentFeeling: FeelingType | null;
  setCurrentFeeling: (currentFeeling: FeelingType) => void;
}

export const FeelingPicker = ({
  currentFeeling,
  setCurrentFeeling,
}: FeelingPickerProps) => {
  const [openFeelingPickerModal, setOpenFeelingPickerModal] =
    useFeelingPicker();
  const feelingWithEmojis = feelingsData.map((feeling) => {
    const emoji = Object.entries(emojiData).find(
      ([_, data]) => data.slug === feeling.emojiSlug
    );

    return {
      feeling: feeling.feeling,
      emoji: emoji ? emoji[0] : null,
    };
  });

  //Immediately Invoked Function Expression (IIFE)
  const sortedFeelingWithEmojis = (() => {
    const currentFeelingObject = currentFeeling
      ? feelingWithEmojis.find(
          (feeling) => feeling.feeling === currentFeeling.feeling
        )
      : null;

    //Remove the current feeling from the array
    const filteredFeelings = feelingWithEmojis.filter(
      (feeling) => feeling.feeling !== currentFeeling?.feeling
    );

    if (currentFeelingObject) {
      filteredFeelings.unshift(currentFeelingObject);
    }

    return filteredFeelings;
  })();

  return (
    <Dialog
      open={openFeelingPickerModal}
      onOpenChange={setOpenFeelingPickerModal}
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
                setOpenFeelingPickerModal(false);
              }}
              className="absolute top-0 left-0 w-8 h-8 flex justify-center items-center rounded-full bg-[#c9ccd1] hover:bg-[#c9ccd1]/50 cursor-pointer"
            >
              <IoIosArrowRoundBack className="size-6" />
            </div>
          </DialogClose>

          <DialogTitle className="h-full text-xl font-semibold">
            How are you feeling?
          </DialogTitle>
        </DialogHeader>

        <Separator className="h-[0.5px]" />

        <div className="grid grid-cols-2 grid-flow-row overflow-y-scroll max-h-[30rem] gap-1 px-2 cursor-pointer">
          {sortedFeelingWithEmojis.map((feeling, index) => (
            <div
              onClick={() => {
                setCurrentFeeling(feeling);
                setOpenFeelingPickerModal(false);
              }}
              key={feeling.feeling}
              className={cn(
                "flex items-center pl-2 gap-x-3 h-11 rounded-lg hover:bg-[#c9ccd1]/50",
                index === 0 && "bg-[#c9ccd1]/30"
              )}
            >
              <div className="flex items-center justify-center size-8 rounded-full bg-gray-400/50">
                {feeling.emoji}
              </div>
              <p className="text-sm">{feeling.feeling}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
