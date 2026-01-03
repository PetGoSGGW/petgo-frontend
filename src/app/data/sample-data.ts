import { User } from '../core/auth/models/user.model';
import { Dog } from '../models/dog.model';
import { Reservation } from '../models/reservation.model';

// Przykład: sample-reservations.ts
export const sampleWalkers: User[] = [
  {
    userId: 201,
    username: 'walker.anna',
    email: 'anna.walker@example.com',
    firstName: 'Anna',
    lastName: 'Kowalska',
    role: 'USER',
    dateOfBirth: new Date('1994-05-20'),
  },
  {
    userId: 202,
    username: 'walker.pawel',
    email: 'pawel.walker@example.com',
    firstName: 'Paweł',
    lastName: 'Nowak',
    role: 'USER',
    dateOfBirth: new Date('1994-05-20'),
  },
];

export const sampleOwners: User[] = [
  {
    userId: 101,
    username: 'owner.marta',
    email: 'marta.owner@example.com',
    firstName: 'Marta',
    lastName: 'Wiśniewska',
    role: 'USER',
    dateOfBirth: new Date('1994-05-20'), // ok. 30 lat
  },
  {
    userId: 102,
    username: 'owner.jan',
    email: 'jan.owner@example.com',
    firstName: 'Jan',
    lastName: 'Lewandowski',
    role: 'USER',
    dateOfBirth: new Date('1994-05-20'), // ok. 30 lat
  },
  {
    userId: 103,
    username: 'owner.ola',
    email: 'ola.owner@example.com',
    firstName: 'Ola',
    lastName: 'Zielińska',
    role: 'USER',
    dateOfBirth: new Date('1994-05-20'), // ok. 30 lat
  },
];

export const sampleDogs: Dog[] = [
  {
    dogId: 501,
    ownerId: sampleOwners[0].userId,
    breed: { breedCode: 'Labrador Retriever', name: 'Labrador Retriever' },
    name: 'Burek',
    notes:
      'Uwielbia aportować. opis moze być bardzo długi i co z tym moge zrobic, zeby dobrze sie wyswietalo',
    size: 'large',
    weightKg: 30,
    isActive: true,
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-12-01T09:30:00Z',
    photos: [
      {
        photoId: 502,
        url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=300&q=80',
        uploadedAt: '2025-12-31T12:00:00Z',
      },
    ],
  },
  {
    dogId: 502,
    ownerId: sampleOwners[1].userId,
    breed: { breedCode: 'BEAGLE', name: 'Beagle' },
    name: 'Reksio',
    notes: 'Energiczny, lubi dłuższe spacery.',
    size: 'medium',
    weightKg: 12,
    isActive: true,
    createdAt: '2025-09-02T08:00:00Z',
    updatedAt: '2025-11-20T12:10:00Z',
    photos: [
      {
        photoId: 502,
        url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=300&q=80',
        uploadedAt: '2025-12-31T12:00:00Z',
      },
    ],
  },
  {
    dogId: 503,
    ownerId: sampleOwners[2].userId,
    breed: { breedCode: 'Border Collie', name: 'Border Collie' },
    name: 'Luna',
    notes: 'Spokojny i posłuszny.',
    size: 'medium',
    weightKg: 16,
    isActive: true,
    createdAt: '2025-07-22T07:45:00Z',
    updatedAt: '2025-12-05T15:25:00Z',
    photos: [
      {
        photoId: 502,
        url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=300&q=80',
        uploadedAt: '2025-12-31T12:00:00Z',
      },
    ],
  },
  {
    dogId: 504,
    ownerId: sampleOwners[1].userId,
    breed: { breedCode: 'German Shepherd', name: 'German Shepherd' },
    name: 'Max',
    notes: 'Spokojny i posłuszny.',
    size: 'large',
    weightKg: 34,
    isActive: true,
    createdAt: '2025-11-01T11:15:00Z',
    updatedAt: '2025-12-10T13:40:00Z',
    photos: [
      {
        photoId: 502,
        url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=300&q=80',
        uploadedAt: '2025-12-31T12:00:00Z',
      },
    ],
  },
];

export const sampleReservations: Reservation[] = [
  {
    reservationId: 1,
    scheduledStart: '2026-01-10T09:00:00Z',
    scheduledEnd: '2026-01-10T10:00:00Z',
    reservationStatus: 'PENDING',
    walker: sampleWalkers[0], // Anna
    owner: sampleOwners[0], // Marta
    dog: sampleDogs[0], // Burek (owner: Marta)
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
  },
  {
    reservationId: 2,
    scheduledStart: '2026-01-12T14:00:00Z',
    scheduledEnd: '2026-01-12T15:30:00Z',
    reservationStatus: 'CONFIRMED',
    walker: sampleWalkers[1], // Paweł
    owner: sampleOwners[1], // Jan
    dog: sampleDogs[1], // Reksio (owner: Jan)
    createdAt: '2025-12-18T09:15:00Z',
    updatedAt: '2025-12-21T08:30:00Z',
  },
  {
    reservationId: 3,
    scheduledStart: '2025-11-20T08:00:00Z',
    scheduledEnd: '2025-11-20T09:00:00Z',
    reservationStatus: 'COMPLETED',
    walker: sampleWalkers[0], // Anna
    owner: sampleOwners[2], // Ola
    dog: sampleDogs[2], // Luna (owner: Ola)
    createdAt: '2025-11-10T12:00:00Z',
    updatedAt: '2025-11-20T09:05:00Z',
  },
  {
    reservationId: 4,
    scheduledStart: '2025-12-05T16:00:00Z',
    scheduledEnd: '2025-12-05T17:00:00Z',
    reservationStatus: 'CANCELLED',
    walker: sampleWalkers[1], // Paweł
    owner: sampleOwners[0], // Marta
    dog: sampleDogs[0], // Burek (owner: Marta)
    createdAt: '2025-11-28T10:45:00Z',
    updatedAt: '2025-12-03T14:20:00Z',
  },
  {
    reservationId: 5,
    scheduledStart: '2026-02-01T10:30:00Z',
    scheduledEnd: '2026-02-01T12:00:00Z',
    reservationStatus: 'CONFIRMED',
    walker: sampleWalkers[0], // Anna
    owner: sampleOwners[1], // Jan
    dog: sampleDogs[3], // Max (owner: Jan)
    createdAt: '2025-12-21T09:10:00Z',
    updatedAt: '2025-12-21T09:10:00Z',
  },
];
