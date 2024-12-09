import { Category } from "./category";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imagePath: string;
    categoryId: number;
    category: Category;
    createdAt: string;
  }