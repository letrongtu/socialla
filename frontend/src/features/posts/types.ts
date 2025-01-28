export type PostType = {
  id: string;
  content: string[] | null;
  feeling: string | null;
  postAudience: string | null;
  fileUrls: string[] | null;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
};
