import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "./header/header";

export const HomePage = () => {
  const router = useRouter();
  const logout = () => {
    deleteCookie("token");
    deleteCookie("userId");
    toast.success("Logout successfully");
    router.replace("/");
  };
  return (
    <div className="h-full w-full flex flex-col bg-[#c9ccd1]/30">
      <Header />
      <div className="flex flex-col">
        <p>This is home page</p>
        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};
