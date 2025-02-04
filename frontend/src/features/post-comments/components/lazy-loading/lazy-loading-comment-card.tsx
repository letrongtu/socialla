"use client";
export const LazyLoadingCommentCard = () => {
  return (
    <div className="flex flex-row justify-between gap-x-2">
      <div className="cursor-pointer">
        <div className="rounded-full size-10 hover:opacity-75 transition bg-[#c9ccd1]/30"></div>
      </div>

      <div className="flex flex-col flex-grow">
        <div className="w-32 h-12 px-3 py-1 rounded-xl bg-[#c9ccd1]/30" />

        <div className="my-2 px-2 py-1 w-32 rounded-xl flex items-center gap-x-3 bg-[#c9ccd1]/30"></div>
      </div>
    </div>
  );
};
