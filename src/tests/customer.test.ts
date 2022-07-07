import dotenv from "dotenv";
import app, { server } from "../../app";
import request from "supertest";
import { HttpStatus } from "../midlewares/handleHttpException";
import mongoose from "mongoose";
import customerModel from "../components/customer/model/mongodb";
import userModel from "../components/user/model/mongodb";
import { createCountry, createCustomer, createUser } from "./app-fabric";
import {
    CustomerReq,
    CustomerRes,
    CustomerUpdate,
} from "../components/customer/dto";

dotenv.config();
const API = request(app);

const createCustomerReal = async (): Promise<CustomerRes> => {
    const [{ _id: countryId, name: country }, { _id: userId, username }] =
        await Promise.all([createCountry(), createUser()]);
    const {
        _id: customerId,
        name,
        email,
        dateOfBirth,
        gender,
        photoUrl,
    } = await createCustomer({ countryId, userId });

    return {
        id: customerId.toJSON(),
        name,
        email,
        dateOfBirth: dateOfBirth.toISOString(),
        gender,
        photoUrl,
        username,
        country,
    };
};

beforeEach(async () => await customerModel.deleteMany({}));

describe("GET, /customers", () => {
    test("NO CONTENT, cuando no hay clientes", async () => {
        const response = await API.get("/customers").send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un cliente", async () => {
        const customerReal = await createCustomerReal();

        const response = await API.get("/customers").send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([customerReal]);
    });
});

describe("GET, /customers/:id", () => {
    test("NOT FOUND, cuando el id no es correcto", async () => {
        const response = await API.get(`/customers/123`).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
    test("OK, cuando el id es correcto", async () => {
        const customerReal = await createCustomerReal();

        const response = await API.get(`/customers/${customerReal.id}`).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual(customerReal);
    });
});

describe("POST, /customers", () => {
    test("BAD REQUEST, cuando el body está vacío", async () => {
        const body = {};

        const response = await API.post("/customers").send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay error de validación", async () => {
        const body: CustomerReq = {
            name: "",
            email: "omar.miranda@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 3, 11),
            user: {
                username: "us",
                password: "12345",
            },
            country: "Perú",
        };

        const response = await API.post("/customers").send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CONFLICT, cuando el email ya existe", async () => {
        const { email } = await createCustomer();
        const body: CustomerReq = {
            name: "Omar Miranda",
            email,
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            user: {
                username: "omar123",
                password: "12345",
            },
            country: "Perú",
        };

        const response = await API.post("/customers").send(body);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CONFLICT, cuando el username ya existe", async () => {
        const { username } = await createUser();
        const body: CustomerReq = {
            name: "Omar Miranda",
            email: "comidev.contacto@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 3, 11),
            user: {
                username,
                password: "12345",
            },
            country: "Perú",
        };

        const response = await API.post("/customers").send(body);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CREATED, cuando se guarda un nuevo cliente", async () => {
        await userModel.deleteMany({});
        const body: CustomerReq = {
            name: "Omar Miranda",
            email: "comidev.contacto@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            user: {
                username: "comidev123",
                password: "12345",
            },
            country: "Perú",
        };

        const response = await API.post("/customers").send(body);

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body.id).toBeDefined();
        expect(response.body).toStrictEqual({
            id: response.body.id,
            name: body.name,
            email: body.email,
            dateOfBirth: body.dateOfBirth.toISOString(),
            gender: body.gender,
            photoUrl: body.photoUrl,
            username: body.user.username,
            country: body.country,
        });
    });
});

describe("DELETE, /customers/:id", () => {
    test("NOT FOUND, cuando el id no es correcto", async () => {
        const response = await API.delete(`/customers/123`).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
    test("OK, cuando el id es correcto", async () => {
        const { _id } = await createCustomer();
        const id = _id.toJSON();

        const response = await API.delete(`/customers/${id}`).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST, /customers/email", () => {
    test("BAD REQUEST, cuando el body está vacío", async () => {
        const body = {};

        const response = await API.post(`/customers/email`).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("OK - false, cuando el email NO existe", async () => {
        const body = { email: "no existo u_u" };

        const response = await API.post(`/customers/email`).send(body);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual({ exists: false });
    });

    test("OK - true, cuando el email SÍ existe", async () => {
        const { email } = await createCustomer();
        const body = { email };

        const response = await API.post(`/customers/email`).send(body);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual({ exists: true });
    });
});

describe("PUT, /customers/:id", () => {
    test("BAD REQUEST, cuando el body está vacío", async () => {
        const body = {};

        const response = await API.put(`/customers/123`).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay error de validación", async () => {
        const body: CustomerUpdate = {
            name: "",
            email: "omar.miranda@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username: "us",
            country: "Perú",
        };

        const response = await API.put(`/customers/123`).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando el ID es incorrecto", async () => {
        const body: CustomerUpdate = {
            name: "Omar Miranda",
            email: "omar.miranda@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username: "omar123",
            country: "Perú",
        };

        const response = await API.put(`/customers/123`).send(body);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("CONFLICT, cuando el nuevo email ya existe", async () => {
        const { email } = await createCustomer();
        const { _id: customerId } = await createCustomer();
        const body: CustomerUpdate = {
            name: "Omar Miranda",
            email,
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username: "omar123",
            country: "Perú",
        };

        const response = await API.put(`/customers/${customerId}`).send(body);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CONFLICT, cuando el nuevo username ya existe", async () => {
        const [{ username }, { _id: customerId }] = await Promise.all([
            createUser(),
            (async () => {
                const { _id: userId } = await createUser();
                return createCustomer({ userId });
            })(),
        ]);

        const body: CustomerUpdate = {
            name: "Omar Miranda",
            email: "comidev.contacto@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username,
            country: "Perú",
        };

        const response = await API.put(`/customers/${customerId}`).send(body);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("OK, cuando se actualiza correctamente", async () => {
        await userModel.deleteMany({});
        const [{ _id: userId }, { _id: countryId }] = await Promise.all([
            createUser(),
            createCountry(),
        ]);
        const { _id: customerId } = await createCustomer({ userId, countryId });
        const body: CustomerUpdate = {
            name: "Omar Miranda",
            email: "comidev.contacto@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username: "comidev123",
            country: "Perú",
        };

        const response = await API.put(`/customers/${customerId}`).send(body);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.id).toBeDefined();
        expect(response.body).toStrictEqual({
            id: response.body.id,
            name: body.name,
            email: body.email,
            dateOfBirth: body.dateOfBirth.toISOString(),
            gender: body.gender,
            photoUrl: body.photoUrl,
            username: body.username,
            country: body.country,
        });
    });
});

afterAll(() => {
    mongoose.disconnect();
    server.close();
});
