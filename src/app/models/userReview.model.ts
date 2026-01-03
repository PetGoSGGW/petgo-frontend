export interface UserReview {
  rating: number;
  comment: string;
  author: Author;
  createdAt: Date;
}

export interface Author {
  userId: number;
  firstName: string;
  lastName: string;
}
