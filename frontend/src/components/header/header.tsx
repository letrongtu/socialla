"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { HeaderPageButton } from "./header-page-button";
import { HeaderUtilButton } from "./header-util-button";
import { SearchBar } from "@/features/search/components/search-bar";

import { NotificationDisplayModal } from "@/features/notifications/components/notification-display-modal";
import { HeaderCurrentUserButton } from "./header-current-user-button";

import { Home, TvMinimalPlay, Bell } from "lucide-react";
import { MdGroups } from "react-icons/md";
import { FiMessageCircle } from "react-icons/fi";
import { HeaderChatModal } from "@/features/conversations/components/header-chat-modal";

const pages = [
  { label: "Home", icon: Home },
  { label: "Videos", icon: TvMinimalPlay },
  { label: "Groups", icon: MdGroups },
];

const utilButtons = [
  //TODO: Enable this if possible { label: "Menu", icon: Layers2, children: <div>Hello</div> },
  { label: "Messenger", icon: FiMessageCircle, children: <HeaderChatModal /> },
  {
    label: "Notifications",
    icon: Bell,
    children: <NotificationDisplayModal />,
  },
];

export const Header = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState("Home");
  const [currentUtilButton, setCurrentUtilButton] = useState<string | null>(
    null
  );

  return (
    <div className="flex flex-row justify-between bg-[#ffffff] px-5 shadow-md">
      <div className="lg:min-w-96 flex justify-start items-center py-3 gap-x-3">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="text-4xl font-bold bg-custom-gradient text-transparent bg-clip-text"
        >
          Socialla
        </button>

        <div className="flex flex-grow">
          <SearchBar />
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
            {utilButton.children}
          </HeaderUtilButton>
        ))}

        <HeaderCurrentUserButton setCurrentUtilButton={setCurrentUtilButton} />
      </div>
    </div>
  );
};
