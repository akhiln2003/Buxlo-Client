export interface IFeedback {
  id: string;
  star: number;
  message: string;
  mentorId: string;
  user: { id: string; avatar: string; name: string };
  createdAt: string;
  updatedAt: string;
  like: string[];
  dislike: string[];
}
