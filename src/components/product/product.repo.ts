import { ProductReq } from "./dto";
import productModel from "./model/mongodb";

export default {
    findAllOrFields: async (filter: object = {}) => {
        const productsDB = await productModel.find(filter);
        return productsDB;
    },
    findById: async (id: any) => {
        const productDB = await productModel.findById(id);
        return productDB;
    },
    update: async (id: string, product: ProductReq) => {
        const productDB = await productModel.findByIdAndUpdate(id, product);
        return productDB;
    },
    deleteById: async (id: string) => {
        await productModel.findByIdAndRemove(id);
    },
    updateStock: async (id: any, stock: number) => {
        await productModel.findByIdAndUpdate(id, { stock });
    },
};
