import { Types } from "mongoose";

export interface InvoiceItemDB {
    quantity: number;
    product: Types.ObjectId;
}

export interface InvoiceItemRes {
    quantity: number;
    price: number;
    name: string;
    photoUrl: string;
    description: string;
}
