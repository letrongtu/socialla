import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

export const getLastActiveTimeString = (lastActiveAt: Date) => {
  const now = new Date();

  const seconds = differenceInSeconds(now, lastActiveAt);
  const minutes = differenceInMinutes(now, lastActiveAt);
  const hours = differenceInHours(now, lastActiveAt);
  const days = differenceInCalendarDays(now, lastActiveAt);
  const weeks = differenceInCalendarWeeks(now, lastActiveAt);
  const months = differenceInCalendarMonths(now, lastActiveAt);
  const years = differenceInCalendarYears(now, lastActiveAt);

  if (seconds < 60) {
    return `1m`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 7) {
    return `${days}d`;
  } else if (weeks < 5) {
    return `${weeks}w`;
  } else if (months < 12) {
    return `${months}m`;
  } else {
    return `${years}y`;
  }
};
