import { model, Schema } from "mongoose";
import { ProductDB } from "../dto";

const ProductSchema = new Schema<ProductDB>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        photoUrl: { type: String, required: true },
        stock: { type: Number, required: true },
        price: { type: Number, required: true },
        categories: [{ type: Schema.Types.ObjectId, ref: "categories" }],
    },
    { timestamps: true, versionKey: false }
);

export default model("products", ProductSchema);
