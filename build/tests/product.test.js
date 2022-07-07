"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importStar(require("../app"));
const handleHttpException_1 = require("../midlewares/handleHttpException");
const mongodb_1 = __importDefault(require("../components/product/model/mongodb"));
const app_fabric_1 = require("./app-fabric");
const role_repo_1 = require("../components/role/role.repo");
dotenv_1.default.config();
const API = (0, supertest_1.default)(app_1.default);
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongodb_1.default.deleteMany({});
}));
describe("GET, /products", () => {
    test("NO CONTENT, cuando no hay ningún producto", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield API.get("/products").send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NO_CONTENT);
    }));
    test("OK, cuando al menos hay un producto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { _id, name, description, stock, price, photoUrl } = yield (0, app_fabric_1.createProduct)();
        const response = yield API.get("/products").send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([
            { id: _id.toJSON(), name, description, stock, price, photoUrl },
        ]);
    }));
    test("NO CONTENT, cuando no hay productos que contienen el nombre", () => __awaiter(void 0, void 0, void 0, function* () {
        const name = "Soy un nombre que no existo";
        const response = yield API.get(`/products?name=${name}`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NO_CONTENT);
    }));
    test("OK, cuando hay al menos un producto que contiene el nombre", () => __awaiter(void 0, void 0, void 0, function* () {
        const { _id, name, description, stock, price, photoUrl } = yield (0, app_fabric_1.createProduct)();
        const response = yield API.get(`/products?name=${name.substring(0, 3)}`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([
            { id: _id.toJSON(), name, description, stock, photoUrl, price },
        ]);
    }));
    test("NOT FOUND, cuando la categoria no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const categoryName = "Soy un nombre que no existo";
        const response = yield API.get(`/products?categoryName=${categoryName}`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("NO CONTENT, cuando la categoria no tiene productos", () => __awaiter(void 0, void 0, void 0, function* () {
        const { name: categoryName } = yield (0, app_fabric_1.createCategory)();
        const response = yield API.get(`/products?categoryName=${categoryName}`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NO_CONTENT);
    }));
    test("OK, cuando la categoría tiene al menos un producto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { _id: categoryId, name: categoryName } = yield (0, app_fabric_1.createCategory)();
        const { _id, name, description, stock, price, photoUrl } = yield (0, app_fabric_1.createProduct)({
            categoryId,
        });
        const response = yield API.get(`/products?categoryName=${categoryName}`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([
            { id: _id.toJSON(), name, description, stock, price, photoUrl },
        ]);
    }));
    test("OK, cuando la categoría tiene al menos un producto que contiene el nombre", () => __awaiter(void 0, void 0, void 0, function* () {
        const { _id: categoryId, name: categoryName } = yield (0, app_fabric_1.createCategory)();
        const { _id, name, description, stock, price, photoUrl } = yield (0, app_fabric_1.createProduct)({
            categoryId,
        });
        const response = yield API.get(`/products?name=${name.substring(0, 3)}&categoryName=${categoryName}`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([
            { id: _id.toJSON(), name, description, stock, price, photoUrl },
        ]);
    }));
});
describe("GET, /products/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto o no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield API.get(`/products/123`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("OK, cuando se encuentra el producto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { _id: id, name, description, price, stock, photoUrl, } = yield (0, app_fabric_1.createProduct)();
        const response = yield API.get(`/products/${id}`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual({
            id: id.toJSON(),
            name,
            description,
            stock,
            price,
            photoUrl,
        });
    }));
});
describe("PUT, /products/:id", () => {
    test("BAD REQUEST, cuando el body está vacío", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const body = {};
        const response = yield API.put(`/products/123`).set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("BAD REQUEST, cuando hay un error de validación", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const body = {
            name: "Producto actualizado",
            description: "Nueva descripcion",
            price: "200 soles",
            stock: -1,
            photoUrl: "soy una imagen",
        };
        const response = yield API.put(`/products/123`).set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("NOT FOUND, cuando el id es incorrecto o no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const body = {
            name: "Producto actualizado",
            description: "Nueva descripcion",
            price: 100.51,
            stock: 10,
            photoUrl: "soy una imagen",
        };
        const response = yield API.put(`/products/123`).set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("OK, cuando se encuentra el producto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const { _id: id } = yield (0, app_fabric_1.createProduct)();
        const body = {
            name: "Producto actualizado",
            description: "Nueva descripcion",
            price: 100.51,
            stock: 10,
            photoUrl: "soy una imagen",
        };
        const response = yield API.put(`/products/${id}`).set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual(Object.assign(Object.assign({}, body), { id: id.toJSON() }));
    }));
});
describe("DELETE, /products/:id", () => {
    test("NOT FOUND, cuando el producto no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const response = yield API.delete(`/products/123`).set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("OK, cuando el producto es 'eliminado'", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const { _id } = yield (0, app_fabric_1.createProduct)();
        const id = _id.toJSON();
        const response = yield API.delete(`/products/${id}`).set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
    }));
});
afterAll(() => {
    mongoose_1.default.disconnect();
    app_1.server.close();
});
