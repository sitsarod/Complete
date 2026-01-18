import type { CategoryInterface } from "./ICategory";

export interface ProductInterface {
  ID?: number;
  Name: string;
  Brand: string;
  Price: number;
  Description: string;
  Picture: string;
  CategoryID: number;
  Category?: CategoryInterface;
}