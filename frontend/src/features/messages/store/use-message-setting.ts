import { UserType } from "@/features/auth/types";
import { PostType } from "@/features/posts/types";
import { atom, useAtom } from "jotai";

type ModalStateType = {
  open: boolean;
  user: UserType | null;
};

const modalState = atom<ModalStateType>({ open: false, user: null });

export const useMessageSetting = () => {
  return useAtom(modalState);
};
