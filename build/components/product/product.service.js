"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_repo_1 = __importDefault(require("../category/category.repo"));
const product_repo_1 = __importDefault(require("./product.repo"));
const handleHttpException_1 = require("../../midlewares/handleHttpException");
const adapterProductRes = (item) => {
    const { _id, name, description, price, stock, photoUrl } = item;
    return { id: _id.toJSON(), name, description, price, stock, photoUrl };
};
exports.default = {
    findAllOrFields: ({ name = "", categoryName = "", }) => __awaiter(void 0, void 0, void 0, function* () {
        const filterMap = new Map();
        if (name)
            filterMap.set("name", { $regex: name, $options: "i" });
        if (categoryName) {
            const categoryDB = yield category_repo_1.default.findByName(categoryName);
            if (!categoryDB) {
                const message = `La categoría '${categoryName}' no existe!`;
                throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
            }
            const categories = categoryDB._id.toJSON();
            filterMap.set("categories", categories);
        }
        const filter = Object.fromEntries(filterMap);
        const productsDB = yield product_repo_1.default.findAllOrFields(filter);
        const products = productsDB.map(adapterProductRes);
        return products;
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        let productDB = null;
        try {
            productDB = yield product_repo_1.default.findById(id);
            if (!productDB)
                throw new Error();
        }
        catch (e) {
            const message = "El producto no existe!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
        return adapterProductRes(productDB);
    }),
    update: (id, product) => __awaiter(void 0, void 0, void 0, function* () {
        if (product.price < 0 || product.stock < 0) {
            const message = "La cantidad mínima es 0";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.BAD_REQUEST, message);
        }
        try {
            yield product_repo_1.default.update(id, product);
            const productDB = yield product_repo_1.default.findById(id);
            if (!productDB)
                throw new Error();
            return adapterProductRes(productDB);
        }
        catch (e) {
            const message = "El producto no existe!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
    }),
    deleteById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield product_repo_1.default.deleteById(id);
        }
        catch (e) {
            const message = "El producto no existe!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
    }),
};
