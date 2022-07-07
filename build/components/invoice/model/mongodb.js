"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InvoiceSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    total: { type: Number, required: true },
    customer: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "customers" },
    invoiceItems: [
        { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "invoice-items" },
    ],
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("invoices", InvoiceSchema);
