"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CountrySchema = new mongoose_1.Schema({ name: { type: String, unique: true, required: true } }, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("countries", CountrySchema);
