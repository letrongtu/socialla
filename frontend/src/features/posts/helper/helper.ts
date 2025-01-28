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

export const getPostCreatedDisplayString = (postCreatedAt: Date) => {
  const now = new Date();

  const postDayOfWeek = format(postCreatedAt, "EEEE,");
  const postCreatedDate = format(postCreatedAt, "MMMM dd, yyyy");
  const postCreatedTime = format(postCreatedAt, "h:mm aa");

  let postCreatedDisplayString: string;

  const seconds = differenceInSeconds(now, postCreatedAt);
  const minutes = differenceInMinutes(now, postCreatedAt);
  const hours = differenceInHours(now, postCreatedAt);

  if (seconds < 60) {
    postCreatedDisplayString = `${seconds}s`;
  } else if (minutes < 60) {
    postCreatedDisplayString = `${minutes}m`;
  } else if (hours < 24) {
    postCreatedDisplayString = `${hours}h`;
  } else {
    postCreatedDisplayString = postCreatedDate + " at " + postCreatedTime;
  }

  const postCreatedDayDateTime =
    postDayOfWeek + " " + postCreatedDate + " at " + postCreatedTime;

  return { postCreatedDisplayString, postCreatedDayDateTime };
};
