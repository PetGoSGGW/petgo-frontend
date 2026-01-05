import { AvailableSlot } from './available-slot.model';

export interface WalkerOffer {
  offerId: number;
  walkerId: number;
  walkerName: string;
  priceCents: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  slots: AvailableSlot[];
}
