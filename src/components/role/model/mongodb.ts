import { model, Schema } from "mongoose";
import { RoleName } from "../role.repo";

const RoleSchema = new Schema(
    { name: { type: String, enum: RoleName, unique: true, required: true } },
    { versionKey: false, timestamps: true }
);

export default model("roles", RoleSchema);
