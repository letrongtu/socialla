import { useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

interface SidebarButtonProps {
  label: string;
  icon: IconType;
}
export const SidebarButton = ({ label, icon: Icon }: SidebarButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(`/${label.toLowerCase()}`);
      }}
      className="w-full py-3 px-3 flex items-center rounded-lg gap-x-3 hover:bg-[#c9ccd1]/30"
    >
      <Icon className="size-7" />
      <p className="text-base font-medium">{label}</p>
    </button>
  );
};
