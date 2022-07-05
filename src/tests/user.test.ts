import dotenv from "dotenv";
import app, { server } from "../../app";
import request from "supertest";
import mongoose from "mongoose";
import userModel from "../components/user/model/mongodb";
import { HttpStatus } from "../midlewares/handleHttpException";
import { createRole, createTokensByRoles, createUser } from "./helpers";
import { isBearer, Payload, Tokens, verify } from "../utils/jwt";
import { RoleName } from "../components/role/role.repo";

dotenv.config();
const API = request(app);

beforeEach(async () => {
    await userModel.deleteMany({});
});

describe("GET /users", () => {
    test("NO CONTENT, cuando no hay usuarios", async () => {
        const response = await API.get(`/users`).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un usuario", async () => {
        const { username } = await createUser();

        const response = await API.get(`/users`).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([{ username }]);
    });
});

describe("POST /users", () => {
    test("BAD REQUEST, cuando no hay body", async () => {
        const response = await API.post(`/users`).send();

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay error de validacion", async () => {
        const userReq = {
            username: "12",
            password: "12",
        };

        const response = await API.post(`/users`).send(userReq);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CONFLICT, cuando el username ya existe", async () => {
        const { username } = await createUser();
        const userReq = {
            username,
            password: "123",
        };

        const response = await API.post(`/users`).send(userReq);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CREATED, cuando se registra correctamente", async () => {
        const userReq = {
            username: "strong_username",
            password: "strong_password",
        };

        const response = await API.post(`/users`).send(userReq);

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

describe("POST, /users/username", () => {
    test("BAD REQUEST, cuando no hay body", async () => {
        const response = await API.post(`/users/username`).send();

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay error de validación", async () => {
        const body = { username: "12" };

        const response = await API.post(`/users/username`).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("OK - false, cuando no existe", async () => {
        const body = { username: "no_existo_jsjs" };

        const response = await API.post(`/users/username`).send(body);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual({ exists: false });
    });

    test("OK - true, cuando sí existe", async () => {
        const { username } = await createUser();
        const body = { username };

        const response = await API.post(`/users/username`).send(body);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual({ exists: true });
    });
});

describe("PATCH, /users/:id/password", () => {
    test("BAD REQUEST, cuando no hay body", async () => {
        const response = await API.patch(`/users/123/password`).send();

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay error de validación", async () => {
        const body = {
            currentPassword: "cu",
            newPassword: "ne",
        };

        const response = await API.patch(`/users/123/password`).send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando no existe el usuario", async () => {
        const body = { currentPassword: "123", newPassword: "123" };

        const response = await API.patch(`/users/123/password`).send(body);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("UNAUTHORIZED, cuando la contraseña no es correcta", async () => {
        const { _id: userId } = await createUser();
        const body = { currentPassword: "soyhacker", newPassword: "123" };

        const response = await API.patch(`/users/${userId}/password`).send(body);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("OK, cuando se actualiza la contraseña", async () => {
        const { _id: userId, password } = await createUser();
        const body = { currentPassword: password, newPassword: "new" };

        const response = await API.patch(`/users/${userId}/password`).send(body);

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST, /users/login", () => {
    test("BAD REQUEST, cuando el body está vacío", async () => {
        const body = {};

        const response = await API.post("/users/login").send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay un error de validación", async () => {
        const body = { username: "us", password: "12" };

        const response = await API.post("/users/login").send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("UNAUTHORIZED, cuando el username no existe", async () => {
        const body = { username: "no_existo", password: "123" };

        const response = await API.post("/users/login").send(body);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("UNAUTHORIZED, cuando el password es incorrecto", async () => {
        const { username } = await createUser();
        const body = { username, password: "error404" };

        const response = await API.post("/users/login").send(body);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("OK, cuando todo es correcto y devuelve el token", async () => {
        const { _id: roleId, name } = await createRole();
        const {
            _id: userId,
            username,
            password,
        } = await createUser({ rolesId: [roleId] });
        const body = { username, password };

        const response = await API.post("/users/login").send(body);

        expect(response.status).toBe(HttpStatus.OK);
        const tokens: Tokens = response.body;

        const bearer = (token: string) => `Bearer ${token}`;

        const areBearer =
            isBearer(bearer(tokens.access_token)) &&
            isBearer(bearer(tokens.refresh_token));
        expect(areBearer).toBeTruthy();
        const payload: Payload = verify(bearer(tokens.access_token));
        expect(payload).toStrictEqual({
            id: userId.toJSON(),
            username,
            roles: [name],
        });
    });
});

describe("POST, /users/token/refresh", () => {
    test("BAD REQUEST, cuando el header.Authorization está vacío", async () => {
        const response = await API.post("/users/token/refresh").send();

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
    test("UNAUTHORIZED, cuando el token es incorrecto", async () => {
        const token = { Authorization: `Bearer xdxdd` };

        const response = await API.post("/users/token/refresh").set(token).send();

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("OK, cuando el token es correcto y devuelve los tokens", async () => {
        const { userId, username, token } = await createTokensByRoles(
            RoleName.ADMIN
        );

        const response = await API.post("/users/token/refresh").set(token).send();

        expect(response.status).toBe(HttpStatus.OK);

        const tokens: Tokens = response.body;
        const bearer = (token: string) => `Bearer ${token}`;
        const areBearer =
            isBearer(bearer(tokens.access_token)) &&
            isBearer(bearer(tokens.refresh_token));

        expect(areBearer).toBeTruthy();

        const payload: Payload = verify(bearer(tokens.access_token));
        expect(payload).toStrictEqual({
            id: userId.toJSON(),
            username,
            roles: [RoleName.ADMIN.toString()],
        });
    });
});

describe("POST, /users/token/validate", () => {
    test("BAD REQUEST, cuando el header.Authorization está vacío", async () => {
        const response = await API.post("/users/token/validate").send();

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("OK - false, cuando el token no es correcto", async () => {
        const token = { Authorization: `Bearer xdxdd` };

        const response = await API.post("/users/token/validate").set(token).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual({ isValid: false });
    });

    test("OK - true, cuando el token es correcto", async () => {
        const { token } = await createTokensByRoles(RoleName.ADMIN);

        const response = await API.post("/users/token/validate").set(token).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual({ isValid: true });
    });
});

afterAll(() => {
    mongoose.disconnect();
    server.close();
});
