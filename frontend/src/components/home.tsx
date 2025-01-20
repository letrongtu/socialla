import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "./header/header";

export const HomePage = () => {
  return (
    <div className="h-full flex flex-col bg-[#c9ccd1]/30">
      <Header />
      <div className="flex flex-col">
        <p>This is home page</p>
      </div>
    </div>
  );
};
