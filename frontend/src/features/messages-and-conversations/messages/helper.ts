import { format, isToday, isYesterday, isThisYear } from "date-fns";

export const getMessageCreatedAtString = (createdAt: Date) => {
  const createdDate = new Date(createdAt);

  if (isToday(createdDate)) {
    return `Today ${format(createdDate, "h:mm a")}`;
  }

  if (isYesterday(createdDate)) {
    return `Yesterday ${format(createdDate, "h:mm a")}`;
  }

  if (isThisYear(createdDate)) {
    return `${format(createdDate, "dd MMM h:mm a")}`;
  }

  return `${format(createdDate, "dd MMM yyyy h:mm a")}`;
};
