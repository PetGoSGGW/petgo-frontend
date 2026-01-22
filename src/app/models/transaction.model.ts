export interface Transaction {
  transactionId: number;
  userId: number;
  amountCents: number;
  balanceAfterCents: number;
  type: string;
  description: string;
  createdAt: string;
}
