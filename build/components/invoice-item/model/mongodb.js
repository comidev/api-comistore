"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InvoiceItemSchema = new mongoose_1.Schema({
    quantity: { type: Number, required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "products" },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("invoice-items", InvoiceItemSchema);
