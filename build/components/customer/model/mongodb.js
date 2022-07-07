"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customer_service_1 = require("../customer.service");
const CustomerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: customer_service_1.Gender, required: true },
    photoUrl: { type: String, required: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true,
    },
    country: { type: mongoose_1.Schema.Types.ObjectId, ref: "countries", required: true },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("customers", CustomerSchema);
