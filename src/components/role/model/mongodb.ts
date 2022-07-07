import { model, Schema } from "mongoose";
import { RoleDB } from "../dto";
import { RoleName } from "../role.repo";

const RoleSchema = new Schema<RoleDB>(
    { name: { type: String, enum: RoleName, unique: true, required: true } },
    { versionKey: false, timestamps: true }
);

export default model("roles", RoleSchema);
