import { Types } from "mongoose";
import { InvoiceItemDB, InvoiceItemRes } from "../../invoice-item/dto";

export interface InvoiceDB {
    description: string;
    total: number;
    customer: Types.ObjectId;
    invoiceItems: Types.ObjectId[];
}

export interface InvoiceReq extends Omit<InvoiceDB, "invoiceItems" | "total"> {
    invoiceItems: InvoiceItemDB[];
}

export interface InvoiceRes extends Omit<InvoiceDB, "invoiceItems" | "customer"> {
    invoiceItems: InvoiceItemRes[];
}
