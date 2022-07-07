import dotenv from "dotenv";
import app, { server } from "../app";
import request from "supertest";
import invoiceModel from "../components/invoice/model/mongodb";
import { HttpStatus } from "../midlewares/handleHttpException";
import mongoose from "mongoose";
import {
    createCustomer,
    createInvoice,
    createInvoiceItem,
    createProduct,
    createTokensByRoles,
} from "./app-fabric";
import { InvoiceItemRes } from "../components/invoice-item/dto";
import { InvoiceRes } from "../components/invoice/dto";
import { RoleName } from "../components/role/role.repo";

dotenv.config();
const API = request(app);

const createInvoiceReal = async (customerId?: any): Promise<InvoiceRes> => {
    const {
        _id: productId,
        price,
        name,
        photoUrl,
        description: des,
    } = await createProduct();
    const { _id: invoiceItemId, quantity } = await createInvoiceItem({ productId });
    const invoiceItems: InvoiceItemRes[] = [
        { quantity, price, name, photoUrl, description: des },
    ];
    const { description, total } = await createInvoice({
        invoiceItemId,
        customerId,
    });
    return { description, total, invoiceItems };
};

beforeEach(async () => {
    await invoiceModel.deleteMany({});
});

describe("GET, /invoices", () => {
    test("NO CONTENT, cuando no hay ninguna compra", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);

        const response = await API.get("/invoices").set(token).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando no hay al menos una compra", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);
        const invoiceReal = await createInvoiceReal();

        const response = await API.get("/invoices").set(token).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([invoiceReal]);
    });
});

describe("GET, /invoices/customer/:id", () => {
    test("NOT FOUND, cuando el ID no es correcto", async () => {
        const { token } = await createTokensByRoles(RoleName.CLIENTE);

        const response = await API.get(`/invoices/customer/123`).set(token).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("NO CONTENT, cuando el cliente no tiene compras", async () => {
        const { token } = await createTokensByRoles(RoleName.CLIENTE);
        const { _id: customerId } = await createCustomer();

        const response = await API.get(`/invoices/customer/${customerId}`)
            .set(token)
            .send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando el cliente tiene al menos una compra", async () => {
        const { token } = await createTokensByRoles(RoleName.CLIENTE);
        const { _id: customerId } = await createCustomer();
        const invoiceReal = await createInvoiceReal(customerId);

        const response = await API.get(`/invoices/customer/${customerId}`)
            .set(token)
            .send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([invoiceReal]);
    });
});

describe("POST, /invoices", () => {
    test("BAD REQUEST, cuando no el body está vacío", async () => {
        const { token } = await createTokensByRoles(RoleName.CLIENTE);
        const body = {};

        const response = await API.post("/invoices").set(token).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay error de validación", async () => {
        const { token } = await createTokensByRoles(RoleName.CLIENTE);
        const body = {
            customer: "123",
            invoiceItems: [],
        };

        const response = await API.post("/invoices").set(token).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando el cliente no existe", async () => {
        const { token } = await createTokensByRoles(RoleName.CLIENTE);
        const body = {
            description: "Descripción",
            customer: "123",
            invoiceItems: [{ quantity: 3, product: "123" }],
        };

        const response = await API.post("/invoices").set(token).send(body);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("NOT FOUND, cuando un producto no existe", async () => {
        const { token } = await createTokensByRoles(RoleName.CLIENTE);
        const { _id: customerId } = await createCustomer();
        const body = {
            description: "Descripción",
            customer: customerId,
            invoiceItems: [{ quantity: 3, product: "123" }],
        };

        const response = await API.post("/invoices").set(token).send(body);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("CREATED, cuando se registra la compra correctamente", async () => {
        const { token } = await createTokensByRoles(RoleName.CLIENTE);
        const { _id: productId } = await createProduct();
        const { _id: customerId } = await createCustomer();
        const body = {
            description: "Descripción",
            customer: customerId,
            invoiceItems: [{ quantity: 3, product: productId }],
        };

        const response = await API.post("/invoices").set(token).send(body);

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

afterAll(() => {
    mongoose.disconnect();
    server.close();
});
