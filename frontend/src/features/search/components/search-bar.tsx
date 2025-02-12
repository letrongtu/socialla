import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Search } from "lucide-react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { SearchResults } from "./search-results";
import { SearchButton } from "./search-button";

export const SearchBar = () => {
  const [searchContent, setSearchContent] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <SearchButton
          searchContent={searchContent}
          setSearchContent={setSearchContent}
        />
      </DialogTrigger>
      <DialogContent
        showOverlayBackground={false}
        showCloseButton={false}
        className="top-0 left-0 translate-x-1 translate-y-1 w-[26rem] flex flex-col justify-center p-3"
      >
        <DialogHeader className="flex flex-row justify-center gap-x-2">
          <DialogTitle className="hidden">Are you absolutely sure?</DialogTitle>

          <DialogClose>
            <div
              onClick={() => {
                setOpen(false);
              }}
              className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-[#c9ccd1]/50 cursor-pointer"
            >
              <IoIosArrowRoundBack className="size-8" />
            </div>
          </DialogClose>

          <SearchButton
            dialogOpen={open}
            searchContent={searchContent}
            setSearchContent={setSearchContent}
          />
        </DialogHeader>

        <SearchResults searchContent={searchContent} />
      </DialogContent>
    </Dialog>
  );
};
