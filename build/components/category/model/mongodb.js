"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({ name: { type: String, required: true, unique: true } }, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)("categories", CategorySchema);
