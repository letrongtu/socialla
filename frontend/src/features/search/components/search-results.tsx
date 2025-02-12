import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useSearch } from "../api/use-search";
import { Loader2 } from "lucide-react";
import { SearchResultUserCard } from "./search-result-user-card";

interface SearchResultsrops {
  searchContent: string;
}

export const SearchResults = ({ searchContent }: SearchResultsrops) => {
  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();
  const { data: resultsData, isLoading: isLoadingResultsData } = useSearch(
    searchContent,
    currentUser?.id ? currentUser.id : null
  );

  if (!resultsData || resultsData.results.length === 0) {
    if (searchContent.trim() !== "") {
      return (
        <div className="flex items-center justify-center">
          <p className="text-base text-muted-foreground">Nothing found</p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center">
        <p className="text-base text-muted-foreground">Nothing to search</p>
      </div>
    );
  }

  if (isLoadingCurrentUser || isLoadingResultsData) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      {resultsData.results.map((user, index) => (
        <SearchResultUserCard key={index} user={user} />
      ))}
    </div>
  );
};
