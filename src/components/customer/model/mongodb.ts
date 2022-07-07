import { model, Schema } from "mongoose";
import { Gender } from "../customer.service";
import { CustomerDB } from "../dto";

const CustomerSchema = new Schema<CustomerDB>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, enum: Gender, required: true },
        photoUrl: { type: String, required: true },
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            unique: true,
        },
        country: { type: Schema.Types.ObjectId, ref: "countries", required: true },
    },
    { timestamps: true, versionKey: false }
);

export default model("customers", CustomerSchema);
