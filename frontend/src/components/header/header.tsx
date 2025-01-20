import { useState } from "react";

import {
  Home,
  Search,
  TvMinimalPlay,
  Layers2,
  MessagesSquare,
  Bell,
  UserRound,
} from "lucide-react";
import { MdGroups } from "react-icons/md";
import { HeaderPageButton } from "./header-page-button";
import { HeaderUtilButton } from "./header-util-button";

const pages = [
  { label: "Home", icon: Home },
  { label: "Video", icon: TvMinimalPlay },
  { label: "Group", icon: MdGroups },
];

//TODO: Change the chilren to proper one
const utilButtons = [
  { label: "Menu", icon: Layers2, chilren: <div>Hello</div> },
  { label: "Messenger", icon: MessagesSquare, chilren: <div>Hello</div> },
  { label: "Notifications", icon: Bell, chilren: <div>Hello</div> },
  { label: "Account", icon: UserRound, chilren: <div>Hello</div> },
];

export const Header = () => {
  const [currentPage, setCurrentPage] = useState("Home");
  const [currentUtilButton, setCurrentUtilButton] = useState<string | null>(
    null
  );

  return (
    <div className="flex flex-row justify-between bg-[#ffffff] px-5">
      <div className="flex justify-center items-center py-3">
        <p className="text-4xl font-bold text-[#283959]">Socialla</p>
        <div className="p-1.5 rounded-full bg-[#c9ccd1]/30 ml-6 lg:w-72 lg:flex lg:gap-x-2 lg:items-center">
          <Search className="text-[#606770]" />
          <p className="text-sm text-muted-foreground">Search Socialla</p>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center gap-x-5">
        {pages.map((page) => (
          <HeaderPageButton
            key={page.label}
            label={page.label}
            icon={page.icon}
            isActive={currentPage === page.label}
            onClick={setCurrentPage}
          />
        ))}
      </div>

      <div className="flex items-center justify-center space-x-3">
        {utilButtons.map((utilButton) => (
          <HeaderUtilButton
            key={utilButton.label}
            label={utilButton.label}
            icon={utilButton.icon}
            currentButton={currentUtilButton}
            setCurrentButton={setCurrentUtilButton}
            isActive={currentUtilButton === utilButton.label}
          >
            {utilButton.chilren}
          </HeaderUtilButton>
        ))}
      </div>
    </div>
  );
};
