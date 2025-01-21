import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreatePostModal = () => {
  return useAtom(modalState);
};
