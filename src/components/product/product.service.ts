import { ProductReq, ProductRes } from "./dto";
import categoryRepo from "../category/category.repo";
import productRepo from "./product.repo";
import { HttpException, HttpStatus } from "../../midlewares/handleHttpException";

const adapterProductRes = (item: any): ProductRes => {
    const { _id, name, description, price, stock, photoUrl } = item;
    return { id: _id.toJSON(), name, description, price, stock, photoUrl };
};

export default {
    findAllOrFields: async ({
        name = "",
        categoryName = "",
    }): Promise<ProductRes[]> => {
        const filterMap = new Map();

        if (name) filterMap.set("name", { $regex: name, $options: "i" });

        if (categoryName) {
            const categoryDB = await categoryRepo.findByName(categoryName);
            if (!categoryDB) {
                const message = `La categoría '${categoryName}' no existe!`;
                throw HttpException(HttpStatus.NOT_FOUND, message);
            }

            const categories = categoryDB._id.toJSON();
            filterMap.set("categories", categories);
        }

        const filter = Object.fromEntries(filterMap);
        const productsDB = await productRepo.findAllOrFields(filter);

        const products: ProductRes[] = productsDB.map(adapterProductRes);
        return products;
    },

    findById: async (id: string): Promise<ProductRes> => {
        let productDB = null;
        try {
            productDB = await productRepo.findById(id);
            if (!productDB) throw new Error();
        } catch (e) {
            const message = "El producto no existe!";
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }

        return adapterProductRes(productDB);
    },

    update: async (id: string, product: ProductReq): Promise<ProductRes> => {
        if (product.price < 0 || product.stock < 0) {
            const message = "La cantidad mínima es 0";
            throw HttpException(HttpStatus.BAD_REQUEST, message);
        }

        try {
            await productRepo.update(id, product);
            const productDB = await productRepo.findById(id);
            if (!productDB) throw new Error();

            return adapterProductRes(productDB);
        } catch (e) {
            const message = "El producto no existe!";
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }
    },

    deleteById: async (id: string) => {
        try {
            await productRepo.deleteById(id);
        } catch (e) {
            const message = "El producto no existe!";
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }
    },
};
