export interface UserReview {
  id: string;
  author: string;
  createdAt: Date;
  text: string;
  rating: number;
  reported: boolean;
}
