import { BasicUserInfo } from './user.model';
import { BasicDogInfo } from './dog.model';

export interface Review {
  comment: string;
  rating: number;
  authorDto: BasicUserInfo;
  createdAt: string;
}

export interface DogReview {
  dogDto: BasicDogInfo;
  reviewDTOList: Review[];
  avgRating: number;
  type: ReviewType;
}

export type ReviewType = 'DOG' | 'WALK' | 'WALKER';
