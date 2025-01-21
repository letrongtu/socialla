import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { ContentSection } from "./content-section";
import { ContactSection } from "./contact-section";

export const HomePage = () => {
  return (
    <div className="h-full flex flex-col bg-[#c9ccd1]/30">
      <Header />
      <div className="h-full w-full flex flex-row justify-between space-y-5">
        <Sidebar />
        <ContentSection />
        <ContactSection />
      </div>
    </div>
  );
};
