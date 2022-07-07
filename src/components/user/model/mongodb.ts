import { model, Schema } from "mongoose";
import { UserDB } from "../dto";

const UserSchema = new Schema<UserDB>(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: [{ type: Schema.Types.ObjectId, ref: "roles" }],
    },
    { versionKey: false, timestamps: true }
);

export default model("users", UserSchema);
