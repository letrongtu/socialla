import { UserType } from "@/features/auth/types";
import { UserContactCard } from "./user-contact-card";

interface ContactContainerProps {
  friendIds: string[];
  currentUser: UserType;
}
export const ContactContainer = ({
  friendIds,
  currentUser,
}: ContactContainerProps) => {
  return (
    <div className="w-full flex flex-col items-center overflow-auto custom-scrollbar">
      {friendIds.map((userId, index) => (
        <UserContactCard
          key={index}
          userId={userId}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};
