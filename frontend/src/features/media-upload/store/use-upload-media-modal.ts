import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useUploadMediaModal = () => {
  return useAtom(modalState);
};
