import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { FeedSection } from "./feed-section/feed-section";
import { ContactSection } from "./contact-section/contact-section";
import { CreateMessageModalTrigger } from "@/features/messages/components/create-mesage-modal-trigger";

export const HomePage = () => {
  return (
    <div className="h-full flex flex-col">
      <Header />

      <div className="h-full flex-grow flex flex-row justify-between space-x-12 overflow-y-scroll pt-5 pl-5">
        <Sidebar />
        <FeedSection />
        <ContactSection />
      </div>
    </div>
  );
};
