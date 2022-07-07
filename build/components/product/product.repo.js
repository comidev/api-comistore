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
const mongodb_1 = __importDefault(require("./model/mongodb"));
exports.default = {
    findAllOrFields: (filter = {}) => __awaiter(void 0, void 0, void 0, function* () {
        const productsDB = yield mongodb_1.default.find(filter);
        return productsDB;
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const productDB = yield mongodb_1.default.findById(id);
        return productDB;
    }),
    update: (id, product) => __awaiter(void 0, void 0, void 0, function* () {
        const productDB = yield mongodb_1.default.findByIdAndUpdate(id, product);
        return productDB;
    }),
    deleteById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield mongodb_1.default.findByIdAndRemove(id);
    }),
    updateStock: (id, stock) => __awaiter(void 0, void 0, void 0, function* () {
        yield mongodb_1.default.findByIdAndUpdate(id, { stock });
    }),
};
