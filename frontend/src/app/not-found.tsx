"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GiReturnArrow } from "react-icons/gi";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex items-center justify-center space-x-16 bg-gradient-to-br from-[#d4f0f0]/30 via-[#0f9bf6]/5 to-[#ecd5e3]/20">
      <div className="flex items-center justify-center">
        <Image
          src="/not-found/maintain.png"
          alt="maintain"
          width={2000}
          height={2000}
          className="max-w-96"
        />
      </div>

      <div className="max-w-[52rem] flex flex-col space-y-3">
        <div className="flex flex-col">
          <p className="text-[4.5rem] font-bold bg-gradient-to-br from-[#d4f0f0] via-[#0f9bf6] to-[#ecd5e3] bg-clip-text text-transparent tracking-wide">
            Oops,
          </p>

          <p className="px-2 -mt-2 text-3xl font-bold bg-gradient-to-br from-[#c9ccd1] to-black/70 bg-clip-text text-transparent">
            This website is still under development. Some pages or features may
            not be available yet.
          </p>
        </div>

        <Button
          onClick={() => router.push("/")}
          className="mx-2 w-52 h-12 bg-[#0f9bf6] hover:bg-[#0f9bf6]/60"
        >
          <GiReturnArrow />

          <p className="text-base">Go back</p>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
