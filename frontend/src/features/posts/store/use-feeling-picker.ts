import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useFeelingPicker = () => {
  return useAtom(modalState);
};
