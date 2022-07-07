"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "roles" }],
}, { versionKey: false, timestamps: true });
exports.default = (0, mongoose_1.model)("users", UserSchema);
