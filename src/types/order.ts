import type { OrderStatus } from "./app";

export type Order = {
  id: string;
  umkmId: string;
  creatorId: string;
  status: OrderStatus;
  totalAmount: number;
};
