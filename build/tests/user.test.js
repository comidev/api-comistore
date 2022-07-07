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
const app_fabric_1 = require("./app-fabric");
const jwt_1 = require("../utils/jwt");
const role_repo_1 = require("../components/role/role.repo");
const mongodb_1 = __importDefault(require("../components/user/model/mongodb"));
dotenv_1.default.config();
const API = (0, supertest_1.default)(app_1.default);
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongodb_1.default.deleteMany({});
}));
describe("GET /users", () => {
    test("NO CONTENT, cuando no hay usuarios", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield API.get(`/users`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NO_CONTENT);
    }));
    test("OK, cuando hay al menos un usuario", () => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = yield (0, app_fabric_1.createUser)();
        const response = yield API.get(`/users`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([{ username }]);
    }));
});
describe("POST /users", () => {
    test("BAD REQUEST, cuando no hay body", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const response = yield API.post(`/users`).set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("BAD REQUEST, cuando hay error de validacion", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const userReq = { username: "12", password: "12" };
        const response = yield API.post(`/users`).set(token).send(userReq);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("CONFLICT, cuando el username ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const { username } = yield (0, app_fabric_1.createUser)();
        const userReq = {
            username,
            password: "123",
        };
        const response = yield API.post(`/users`).set(token).send(userReq);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.CONFLICT);
    }));
    test("CREATED, cuando se registra correctamente", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const userReq = {
            username: "strong_username",
            password: "strong_password",
        };
        const response = yield API.post(`/users`).set(token).send(userReq);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.CREATED);
    }));
});
describe("POST, /users/username", () => {
    test("BAD REQUEST, cuando no hay body", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield API.post(`/users/username`).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("BAD REQUEST, cuando hay error de validación", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = { username: "12" };
        const response = yield API.post(`/users/username`).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("OK - false, cuando no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = { username: "no_existo_jsjs" };
        const response = yield API.post(`/users/username`).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual({ exists: false });
    }));
    test("OK - true, cuando sí existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = yield (0, app_fabric_1.createUser)();
        const body = { username };
        const response = yield API.post(`/users/username`).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual({ exists: true });
    }));
});
describe("PATCH, /users/:id/password", () => {
    test("BAD REQUEST, cuando no hay body", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const response = yield API.patch(`/users/1234567/password`)
            .set(token)
            .send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("BAD REQUEST, cuando hay error de validación", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const body = {
            currentPassword: "cu",
            newPassword: "ne",
        };
        const response = yield API.patch(`/users/123/password`)
            .set(token)
            .send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("NOT FOUND, cuando no existe el usuario", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const body = { currentPassword: "123", newPassword: "123" };
        const response = yield API.patch(`/users/123/password`)
            .set(token)
            .send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("UNAUTHORIZED, cuando la contraseña no es correcta", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const { _id: userId } = yield (0, app_fabric_1.createUser)();
        const body = { currentPassword: "soyhacker", newPassword: "123" };
        const response = yield API.patch(`/users/${userId}/password`)
            .set(token)
            .send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.UNAUTHORIZED);
    }));
    test("OK, cuando se actualiza la contraseña", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const { _id: userId, password } = yield (0, app_fabric_1.createUser)();
        const body = { currentPassword: password, newPassword: "new" };
        const response = yield API.patch(`/users/${userId}/password`)
            .set(token)
            .send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
    }));
});
describe("POST, /users/login", () => {
    test("BAD REQUEST, cuando el body está vacío", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {};
        const response = yield API.post("/users/login").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("BAD REQUEST, cuando hay un error de validación", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = { username: "us", password: "12" };
        const response = yield API.post("/users/login").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("UNAUTHORIZED, cuando el username no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = { username: "no_existo", password: "123" };
        const response = yield API.post("/users/login").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.UNAUTHORIZED);
    }));
    test("UNAUTHORIZED, cuando el password es incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = yield (0, app_fabric_1.createUser)();
        const body = { username, password: "error404" };
        const response = yield API.post("/users/login").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.UNAUTHORIZED);
    }));
    test("OK, cuando todo es correcto y devuelve el token", () => __awaiter(void 0, void 0, void 0, function* () {
        const { _id: roleId, name } = yield (0, app_fabric_1.createRole)();
        const { _id: userId, username, password, } = yield (0, app_fabric_1.createUser)({ rolesId: [roleId] });
        const body = { username, password };
        const response = yield API.post("/users/login").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        const tokens = response.body;
        const bearer = (token) => `Bearer ${token}`;
        const areBearer = (0, jwt_1.isBearer)(bearer(tokens.access_token)) &&
            (0, jwt_1.isBearer)(bearer(tokens.refresh_token));
        expect(areBearer).toBeTruthy();
        const payload = (0, jwt_1.verify)(bearer(tokens.access_token));
        expect(payload).toStrictEqual({
            id: userId.toJSON(),
            username,
            roles: [name],
        });
    }));
});
describe("POST, /users/token/refresh", () => {
    test("UNAUTHORIZED, cuando el header.Authorization está vacío", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield API.post("/users/token/refresh").send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.UNAUTHORIZED);
    }));
    test("UNAUTHORIZED, cuando el token es incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = { Authorization: `Bearer xdxdd` };
        const response = yield API.post("/users/token/refresh").set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.UNAUTHORIZED);
    }));
    test("OK, cuando el token es correcto y devuelve los tokens", () => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, username, token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const response = yield API.post("/users/token/refresh").set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        const tokens = response.body;
        const bearer = (token) => `Bearer ${token}`;
        const areBearer = (0, jwt_1.isBearer)(bearer(tokens.access_token)) &&
            (0, jwt_1.isBearer)(bearer(tokens.refresh_token));
        expect(areBearer).toBeTruthy();
        const payload = (0, jwt_1.verify)(bearer(tokens.access_token));
        expect(payload).toStrictEqual({
            id: userId.toJSON(),
            username,
            roles: [role_repo_1.RoleName.CLIENTE.toString()],
        });
    }));
});
describe("POST, /users/token/validate", () => {
    test("UNAUTHORIZED, cuando el header.Authorization está vacío", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield API.post("/users/token/validate").send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.UNAUTHORIZED);
    }));
    test("OK - false, cuando el token no es correcto", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = { Authorization: `Bearer xdxdd` };
        const response = yield API.post("/users/token/validate").set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual({ isValid: false });
    }));
    test("OK - true, cuando el token es correcto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const response = yield API.post("/users/token/validate").set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual({ isValid: true });
    }));
});
afterAll(() => {
    mongoose_1.default.disconnect();
    app_1.server.close();
});
