"use client";

import { useState } from "react";

import {
  Home,
  Search,
  TvMinimalPlay,
  Layers2,
  MessagesSquare,
  Bell,
} from "lucide-react";
import { MdGroups } from "react-icons/md";
import { HeaderPageButton } from "./header-page-button";
import { HeaderUtilButton } from "./header-util-button";
import { UserButton } from "./user-button";
import { useRouter } from "next/navigation";

const pages = [
  { label: "Home", icon: Home },
  { label: "Videos", icon: TvMinimalPlay },
  { label: "Groups", icon: MdGroups },
];

//TODO: Change the chilren to proper one
const utilButtons = [
  { label: "Menu", icon: Layers2, chilren: <div>Hello</div> },
  { label: "Messenger", icon: MessagesSquare, chilren: <div>Hello</div> },
  { label: "Notifications", icon: Bell, chilren: <div>Hello</div> },
];

export const Header = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState("Home");
  const [currentUtilButton, setCurrentUtilButton] = useState<string | null>(
    null
  );

  return (
    <div className="flex flex-row justify-between bg-[#ffffff] px-5 shadow-md">
      <div className="lg:min-w-96 flex justify-start items-center py-3 ">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="text-4xl font-bold bg-custom-gradient text-transparent bg-clip-text"
        >
          Socialla
        </button>

        <div className="flex flex-grow">
          <div
            onClick={() => {}}
            className="p-1.5 rounded-full bg-[#c9ccd1]/30 ml-6 lg:flex lg:gap-x-2 lg:items-center lg:w-full flex-grow"
          >
            {/**TODO: Onclick Search button */}
            <Search className="text-[#606770] size-6" />
            <p className="hidden lg:inline-block text-sm text-muted-foreground">
              Search Socialla
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl flex-grow hidden md:flex items-center justify-evenly gap-x-5">
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

      <div className="lg:min-w-96 flex items-center justify-end space-x-3">
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

        <UserButton />
      </div>
    </div>
  );
};
