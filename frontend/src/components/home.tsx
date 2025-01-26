import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { FeedSection } from "./feed-section";
import { ContactSection } from "./contact-section";

export const HomePage = () => {
  return (
    <div className="h-full flex flex-col bg-[#c9ccd1]/30 space-y-5">
      <Header />
      <div className="h-full w-full flex flex-row justify-center space-x-12">
        <Sidebar />
        <FeedSection />
        <ContactSection />
      </div>
    </div>
  );
};
