"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const role_repo_1 = require("../role.repo");
const RoleSchema = new mongoose_1.Schema({ name: { type: String, enum: role_repo_1.RoleName, unique: true, required: true } }, { versionKey: false, timestamps: true });
exports.default = (0, mongoose_1.model)("roles", RoleSchema);
