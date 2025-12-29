import { Dog } from '../../../../../models/dog.model';

export type EditDogDetailsDialogData = Pick<
  Dog,
  'name' | 'breed' | 'notes' | 'size' | 'weightKg' | 'isActive'
>;
