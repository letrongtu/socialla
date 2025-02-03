import { PostType } from "@/features/posts/types";
import { atom, useAtom } from "jotai";

type ModalStateType = {
  open: boolean;
  postData: PostType | null;
};

const modalState = atom<ModalStateType>({ open: false, postData: null });

export const usePostCommentModal = () => {
  return useAtom(modalState);
};
