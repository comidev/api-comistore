import { model, Schema } from "mongoose";

const UserSchema = new Schema(
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
