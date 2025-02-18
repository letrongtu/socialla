import { PostType } from "@/features/posts/types";
import { atom, useAtom } from "jotai";

type ModalStateType = {
  open: boolean;
  userId: string | null;
};

const modalState = atom<ModalStateType>({ open: false, userId: null });

export const useMessageModal = () => {
  return useAtom(modalState);
};
