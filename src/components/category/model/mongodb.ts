import { model, Schema } from "mongoose";
import { CategoryDB } from "../dto";

const CategorySchema = new Schema<CategoryDB>(
    { name: { type: String, required: true, unique: true } },
    { timestamps: true, versionKey: false }
);

export default model("categories", CategorySchema);
