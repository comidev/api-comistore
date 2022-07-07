import { model, Schema } from "mongoose";
import { CountryDB } from "../dto";

const CountrySchema = new Schema<CountryDB>(
    { name: { type: String, unique: true, required: true } },
    { timestamps: true, versionKey: false }
);

export default model("countries", CountrySchema);
