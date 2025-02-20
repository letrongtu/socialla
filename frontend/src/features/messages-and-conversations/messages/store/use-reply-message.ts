import { atom, useAtom } from "jotai";
import { MessageType } from "../types";

type ModalStateType = {
  open: boolean;
  message: MessageType | null;
};

const modalState = atom<ModalStateType>({
  open: false,
  message: null,
});

export const useReplyMessage = () => {
  return useAtom(modalState);
};
