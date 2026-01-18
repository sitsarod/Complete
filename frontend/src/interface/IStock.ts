import type { ProductInterface } from './IProduct';

export interface StockInterface {
  ID?: number;
  Quantity: number;
  Product?: ProductInterface;
}
