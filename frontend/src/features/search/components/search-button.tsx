import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchButtonProps {
  dialogOpen?: boolean;
  searchContent: string;
  setSearchContent: (content: string) => void;
}
export const SearchButton = ({
  dialogOpen = false,
  searchContent,
  setSearchContent,
}: SearchButtonProps) => {
  return (
    <div className="h-10 p-1.5 rounded-full bg-[#c9ccd1]/30 lg:flex lg:gap-x-2 lg:items-center lg:w-full flex-grow">
      {!dialogOpen && <Search className="text-[#606770] size-5" />}
      <input
        autoFocus={dialogOpen}
        value={searchContent}
        onChange={(e) => setSearchContent(e.target.value)}
        placeholder="Search Socialla"
        className={cn(
          "hidden lg:inline-block text-base w-full mr-3 bg-transparent focus:outline-none",
          dialogOpen && "pl-2"
        )}
      />
    </div>
  );
};
