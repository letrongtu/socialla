import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";

export const getCreatedTimeString = (CreatedAt: Date) => {
  const now = new Date();

  const postDayOfWeek = format(CreatedAt, "EEEE,");
  const postCreatedDate = format(CreatedAt, "MMMM dd, yyyy");
  const postCreatedTime = format(CreatedAt, "h:mm aa");

  let createdDisplayString: string;

  const seconds = differenceInSeconds(now, CreatedAt);
  const minutes = differenceInMinutes(now, CreatedAt);
  const hours = differenceInHours(now, CreatedAt);
  const days = differenceInCalendarDays(now, CreatedAt);
  const weeks = differenceInCalendarWeeks(now, CreatedAt);
  const months = differenceInCalendarMonths(now, CreatedAt);
  const years = differenceInCalendarYears(now, CreatedAt);

  if (seconds === 0) {
    createdDisplayString = `Now`;
  } else if (seconds < 60) {
    createdDisplayString = `a minute ago`;
  } else if (minutes < 60) {
    createdDisplayString = `${minutes} minutes ago`;
  } else if (hours === 1) {
    createdDisplayString = `an hour ago`;
  } else if (hours < 24) {
    createdDisplayString = `${hours} hours ago`;
  } else if (days === 1) {
    createdDisplayString = `a day ago`;
  } else if (days < 7) {
    createdDisplayString = `${days} days ago`;
  } else if (weeks === 1) {
    createdDisplayString = `a week ago`;
  } else if (weeks < 5) {
    createdDisplayString = `${weeks} weeks ago`;
  } else if (months === 1) {
    createdDisplayString = `a month ago`;
  } else if (months < 12) {
    createdDisplayString = `${months} months ago`;
  } else if (years === 1) {
    createdDisplayString = `a year ago`;
  } else {
    createdDisplayString = `${years} years ago`;
  }

  const createdDayDateTime =
    postDayOfWeek + " " + postCreatedDate + " at " + postCreatedTime;

  return { createdDisplayString, createdDayDateTime };
};
