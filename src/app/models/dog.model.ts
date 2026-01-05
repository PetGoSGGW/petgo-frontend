import { Breed } from './breed.model';

export interface Photo {
  photoId: number;
  url: string;
  uploadedAt: string;
}

export interface Dog {
  dogId: number;
  ownerId: number;
  breed: Breed;
  name: string;
  size: string;
  notes: string;
  weightKg: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  photos: Photo[];
}
