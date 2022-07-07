import { model, Schema } from "mongoose";
import { InvoiceDB } from "../dto";

const InvoiceSchema = new Schema<InvoiceDB>(
    {
        description: { type: String, required: true },
        total: { type: Number, required: true },
        customer: { type: Schema.Types.ObjectId, required: true, ref: "customers" },
        invoiceItems: [
            { type: Schema.Types.ObjectId, required: true, ref: "invoice-items" },
        ],
    },
    { timestamps: true, versionKey: false }
);

export default model("invoices", InvoiceSchema);
