import { atom, useAtom } from "jotai";

const isLoadMore = atom(false);
export const useLoadMorePosts = () => {
  return useAtom(isLoadMore);
};
