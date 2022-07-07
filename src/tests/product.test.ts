import dotenv from "dotenv";
import mongoose from "mongoose";
import request from "supertest";
import app, { server } from "../app";
import { HttpStatus } from "../midlewares/handleHttpException";
import productModel from "../components/product/model/mongodb";
import { createCategory, createProduct, createTokensByRoles } from "./app-fabric";
import { RoleName } from "../components/role/role.repo";

dotenv.config();
const API = request(app);

beforeEach(async () => {
    await productModel.deleteMany({});
});

describe("GET, /products", () => {
    test("NO CONTENT, cuando no hay ningún producto", async () => {
        const response = await API.get("/products").send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando al menos hay un producto", async () => {
        const { _id, name, description, stock, price, photoUrl } =
            await createProduct();

        const response = await API.get("/products").send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([
            { id: _id.toJSON(), name, description, stock, price, photoUrl },
        ]);
    });

    test("NO CONTENT, cuando no hay productos que contienen el nombre", async () => {
        const name = "Soy un nombre que no existo";

        const response = await API.get(`/products?name=${name}`).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un producto que contiene el nombre", async () => {
        const { _id, name, description, stock, price, photoUrl } =
            await createProduct();

        const response = await API.get(
            `/products?name=${name.substring(0, 3)}`
        ).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([
            { id: _id.toJSON(), name, description, stock, photoUrl, price },
        ]);
    });

    test("NOT FOUND, cuando la categoria no existe", async () => {
        const categoryName = "Soy un nombre que no existo";

        const response = await API.get(
            `/products?categoryName=${categoryName}`
        ).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("NO CONTENT, cuando la categoria no tiene productos", async () => {
        const { name: categoryName } = await createCategory();

        const response = await API.get(
            `/products?categoryName=${categoryName}`
        ).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando la categoría tiene al menos un producto", async () => {
        const { _id: categoryId, name: categoryName } = await createCategory();
        const { _id, name, description, stock, price, photoUrl } =
            await createProduct({
                categoryId,
            });

        const response = await API.get(
            `/products?categoryName=${categoryName}`
        ).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([
            { id: _id.toJSON(), name, description, stock, price, photoUrl },
        ]);
    });

    test("OK, cuando la categoría tiene al menos un producto que contiene el nombre", async () => {
        const { _id: categoryId, name: categoryName } = await createCategory();
        const { _id, name, description, stock, price, photoUrl } =
            await createProduct({
                categoryId,
            });

        const response = await API.get(
            `/products?name=${name.substring(0, 3)}&categoryName=${categoryName}`
        ).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([
            { id: _id.toJSON(), name, description, stock, price, photoUrl },
        ]);
    });
});

describe("GET, /products/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto o no existe", async () => {
        const response = await API.get(`/products/123`).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando se encuentra el producto", async () => {
        const {
            _id: id,
            name,
            description,
            price,
            stock,
            photoUrl,
        } = await createProduct();

        const response = await API.get(`/products/${id}`).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual({
            id: id.toJSON(),
            name,
            description,
            stock,
            price,
            photoUrl,
        });
    });
});

describe("PUT, /products/:id", () => {
    test("BAD REQUEST, cuando el body está vacío", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);
        const body = {};

        const response = await API.put(`/products/123`).set(token).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay un error de validación", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);
        const body = {
            name: "Producto actualizado",
            description: "Nueva descripcion",
            price: "200 soles",
            stock: -1,
            photoUrl: "soy una imagen",
        };

        const response = await API.put(`/products/123`).set(token).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando el id es incorrecto o no existe", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);
        const body = {
            name: "Producto actualizado",
            description: "Nueva descripcion",
            price: 100.51,
            stock: 10,
            photoUrl: "soy una imagen",
        };

        const response = await API.put(`/products/123`).set(token).send(body);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando se encuentra el producto", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);
        const { _id: id } = await createProduct();
        const body = {
            name: "Producto actualizado",
            description: "Nueva descripcion",
            price: 100.51,
            stock: 10,
            photoUrl: "soy una imagen",
        };

        const response = await API.put(`/products/${id}`).set(token).send(body);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual({ ...body, id: id.toJSON() });
    });
});

describe("DELETE, /products/:id", () => {
    test("NOT FOUND, cuando el producto no existe", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);

        const response = await API.delete(`/products/123`).set(token).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el producto es 'eliminado'", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);
        const { _id } = await createProduct();
        const id = _id.toJSON();

        const response = await API.delete(`/products/${id}`).set(token).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

afterAll(() => {
    mongoose.disconnect();
    server.close();
});
