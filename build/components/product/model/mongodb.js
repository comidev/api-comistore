"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "categories" }],
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("products", ProductSchema);
