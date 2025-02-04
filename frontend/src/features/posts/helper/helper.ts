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
    createdDisplayString = `Just Now`;
  } else if (seconds < 60) {
    createdDisplayString = `${seconds}s`;
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
