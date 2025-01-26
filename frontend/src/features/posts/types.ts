export type PostType = {
  content: string[] | null;
  feeling: string | null;
  postAudience: string | null;
  fileUrls: string[] | null;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
};
