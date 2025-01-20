import { IconType } from "react-icons/lib";

import { cn } from "@/lib/utils";
import { Hint } from "../ui/hint";

interface HeaderPageButtonProps {
  label: string;
  onClick: (page: string) => void;
  isActive?: boolean;
  icon: IconType;
}

export const HeaderPageButton = ({
  label,
  onClick,
  isActive,
  icon: Icon,
}: HeaderPageButtonProps) => {
  //TODO: Redirect to the label
  return (
    <Hint label={label}>
      <button
        onClick={() => onClick(label)}
        className={cn(
          "flex h-full w-32 items-center justify-center transition-all duration-200",
          isActive
            ? "border-b-4 border-b-[#283959]"
            : "h-[80%] border-4 border-hidden hover:bg-[#c9ccd1]/30 hover:rounded-sm"
        )}
      >
        <Icon
          className={cn(
            "w-full text-[#606770] size-7",
            isActive ? "text-[#283959]" : "text-[#606770]"
          )}
        />
      </button>
    </Hint>
  );
};
