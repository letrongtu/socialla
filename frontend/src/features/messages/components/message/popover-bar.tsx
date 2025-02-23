import { cn } from "@/lib/utils";
import { MessageType } from "../../types";

interface PopoverBarProps {
  message: MessageType;
}

export const PopoverBar = ({ message }: PopoverBarProps) => {
  return (
    <div className={cn("hidden group-hover/message:flex")}>PopoverBar</div>
  );
};
