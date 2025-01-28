import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <Hint label={label}>
      <button
        onClick={() => {
          onClick(label);
          router.push(`/${label.toLowerCase()}`);
        }}
        className={cn(
          "flex h-full w-full items-center justify-center transition-all duration-200 group",
          isActive
            ? "border-b-4 border-b-[#1823ab]"
            : "h-[80%] border-4 border-hidden hover:bg-slate-100 hover:rounded-sm"
        )}
      >
        <Icon
          className={cn(
            "w-full text-[#606770] size-7 group-hover:size-8 group-hover:text-[#1823ab]",
            isActive ? "text-[#1823ab]" : "text-[#606770]"
          )}
        />
      </button>
    </Hint>
  );
};
