import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";

export const urlsToFiles = async (urls: string[]): Promise<File[]> => {
  const files = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();

      const filename = url.split("/").pop() || "default-file-name";
      return new File([blob], filename, { type: blob.type });
    })
  );
  return files;
};

export const getCreatedDisplayString = (CreatedAt: Date) => {
  const now = new Date();

  const postDayOfWeek = format(CreatedAt, "EEEE,");
  const postCreatedDate = format(CreatedAt, "MMMM dd, yyyy");
  const postCreatedTime = format(CreatedAt, "h:mm aa");

  let createdDisplayString: string;

  const seconds = differenceInSeconds(now, CreatedAt);
  const minutes = differenceInMinutes(now, CreatedAt);
  const hours = differenceInHours(now, CreatedAt);

  if (seconds === 0) {
    createdDisplayString = `Now`;
  } else if (seconds < 60) {
    createdDisplayString = `1m`;
  } else if (minutes < 60) {
    createdDisplayString = `${minutes}m`;
  } else if (hours < 24) {
    createdDisplayString = `${hours}h`;
  } else {
    createdDisplayString = postCreatedDate + " at " + postCreatedTime;
  }

  const createdDayDateTime =
    postDayOfWeek + " " + postCreatedDate + " at " + postCreatedTime;

  return { createdDisplayString, createdDayDateTime };
};

export const getCountString = (
  reactionsCount: number,
  type: string
): string => {
  const typeString = " " + type;
  const typesString = " " + type + "s";

  let reactionsCountString: string;

  if (reactionsCount === 1) {
    reactionsCountString = reactionsCount.toString() + typeString;
  } else if (reactionsCount < 1000) {
    reactionsCountString = reactionsCount.toString() + typesString; // Less than 1K, show full number
  } else if (reactionsCount < 1_000_000) {
    reactionsCountString =
      (reactionsCount / 1000).toFixed(1).replace(/\.0$/, "") +
      "K" +
      typesString; // Thousands
  } else if (reactionsCount < 1_000_000_000) {
    reactionsCountString =
      (reactionsCount / 1_000_000).toFixed(1).replace(/\.0$/, "") +
      "M" +
      typesString; // Millions
  } else if (reactionsCount < 1_000_000_000_000) {
    reactionsCountString =
      (reactionsCount / 1_000_000_000).toFixed(1).replace(/\.0$/, "") +
      "B" +
      typesString; // Billions
  } else {
    reactionsCountString =
      (reactionsCount / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") +
      "T" +
      typesString; // Trillions
  }

  return reactionsCountString;
};
