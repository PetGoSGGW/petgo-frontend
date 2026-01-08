export interface UserReview {
  rating: number;
  comment: string;
  author: Author;
  createdAt: string;
}

export interface Author {
  userId: number;
  firstName: string;
  lastName: string;
}
