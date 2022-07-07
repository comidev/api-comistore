import { Types } from "mongoose";

export interface ProductDB {
    name: string;
    description: string;
    photoUrl: string;
    stock: number;
    price: number;
    categories: [Types.ObjectId];
}

export type ProductReq = Omit<ProductDB, "categories">;

export interface ProductRes extends ProductReq {
    id: string;
}
