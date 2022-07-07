import { model, Schema } from "mongoose";
import { InvoiceItemDB } from "../dto";

const InvoiceItemSchema = new Schema<InvoiceItemDB>(
    {
        quantity: { type: Number, required: true },
        product: { type: Schema.Types.ObjectId, required: true, ref: "products" },
    },
    { timestamps: true, versionKey: false }
);

export default model("invoice-items", InvoiceItemSchema);
