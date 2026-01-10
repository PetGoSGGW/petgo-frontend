export interface WalkerReviewsResponse {
  reviewDTOList: UserReview[];
  avgRating: number;
  type: string;
  walkerInfoDto: {
    userId: number;
    firstName: string;
    lastName: string;
  };
}
export interface UserReview {
  rating: number;
  comment: string;
  authorDto: Author;
  createdAt: string;
}

export interface Author {
  userId: number;
  firstName: string;
  lastName: string;
}
