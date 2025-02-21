import { atom, useAtom } from "jotai";

type ModalStateType = {
  open: boolean;
};

const modalState = atom(false);

export const useUnsendMessage = () => {
  return useAtom(modalState);
};
