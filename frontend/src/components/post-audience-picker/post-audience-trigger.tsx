import { useState } from "react";

import { IoCaretDown } from "react-icons/io5";
import { IconType } from "react-icons/lib";

interface PostAudienceTriggerProps {
  label: string;
  icon: IconType;
  setOpenPostAudiencePicker: (openPostAudiencePicker: boolean) => void;
}

export const PostAudienceTrigger = ({
  label,
  icon: Icon,
  setOpenPostAudiencePicker,
}: PostAudienceTriggerProps) => {
  return (
    <button
      onClick={() => {
        setOpenPostAudiencePicker(true);
      }}
      className="max-w-20 py-1 flex items-center justify-center space-x-1 rounded-lg bg-[#c9ccd1]/30 hover:bg-slate-100"
    >
      <Icon className="size-3" />
      <p className="text-xs font-medium">{label}</p>
      <IoCaretDown className="size-3" />
    </button>
  );
};
