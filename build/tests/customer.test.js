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
const app_1 = __importStar(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const handleHttpException_1 = require("../midlewares/handleHttpException");
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = __importDefault(require("../components/customer/model/mongodb"));
const mongodb_2 = __importDefault(require("../components/user/model/mongodb"));
const app_fabric_1 = require("./app-fabric");
const role_repo_1 = require("../components/role/role.repo");
dotenv_1.default.config();
const API = (0, supertest_1.default)(app_1.default);
const createCustomerReal = () => __awaiter(void 0, void 0, void 0, function* () {
    const [{ _id: countryId, name: country }, { _id: userId, username }] = yield Promise.all([(0, app_fabric_1.createCountry)(), (0, app_fabric_1.createUser)()]);
    const { _id: customerId, name, email, dateOfBirth, gender, photoUrl, } = yield (0, app_fabric_1.createCustomer)({ countryId, userId });
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
});
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield mongodb_1.default.deleteMany({}); }));
describe("GET, /customers", () => {
    test("NO CONTENT, cuando no hay clientes", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const response = yield API.get("/customers").set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NO_CONTENT);
    }));
    test("OK, cuando hay al menos un cliente", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const customerReal = yield createCustomerReal();
        const response = yield API.get("/customers").set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([customerReal]);
    }));
});
describe("GET, /customers/:id", () => {
    test("NOT FOUND, cuando el id no es correcto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const response = yield API.get(`/customers/123`).set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("OK, cuando el id es correcto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const customerReal = yield createCustomerReal();
        const response = yield API.get(`/customers/${customerReal.id}`)
            .set(token)
            .send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual(customerReal);
    }));
});
describe("POST, /customers", () => {
    test("BAD REQUEST, cuando el body está vacío", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {};
        const response = yield API.post("/customers").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("BAD REQUEST, cuando hay error de validación", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
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
        const response = yield API.post("/customers").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("CONFLICT, cuando el email ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = yield (0, app_fabric_1.createCustomer)();
        const body = {
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
        const response = yield API.post("/customers").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.CONFLICT);
    }));
    test("CONFLICT, cuando el username ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = yield (0, app_fabric_1.createUser)();
        const body = {
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
        const response = yield API.post("/customers").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.CONFLICT);
    }));
    test("CREATED, cuando se guarda un nuevo cliente", () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongodb_2.default.deleteMany({});
        const body = {
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
        const response = yield API.post("/customers").send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.CREATED);
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
    }));
});
describe("DELETE, /customers/:id", () => {
    test("NOT FOUND, cuando el id no es correcto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const response = yield API.delete(`/customers/123`).set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("OK, cuando el id es correcto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const { _id } = yield (0, app_fabric_1.createCustomer)();
        const id = _id.toJSON();
        const response = yield API.delete(`/customers/${id}`).set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
    }));
});
describe("POST, /customers/email", () => {
    test("BAD REQUEST, cuando el body está vacío", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {};
        const response = yield API.post(`/customers/email`).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("OK - false, cuando el email NO existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = { email: "no existo u_u" };
        const response = yield API.post(`/customers/email`).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual({ exists: false });
    }));
    test("OK - true, cuando el email SÍ existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = yield (0, app_fabric_1.createCustomer)();
        const body = { email };
        const response = yield API.post(`/customers/email`).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual({ exists: true });
    }));
});
describe("PUT, /customers/:id", () => {
    test("BAD REQUEST, cuando el body está vacío", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const body = {};
        const response = yield API.put(`/customers/123`).set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("BAD REQUEST, cuando hay error de validación", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const body = {
            name: "",
            email: "omar.miranda@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username: "us",
            country: "Perú",
        };
        const response = yield API.put(`/customers/123`).set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("NOT FOUND, cuando el ID es incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const body = {
            name: "Omar Miranda",
            email: "omar.miranda@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username: "omar123",
            country: "Perú",
        };
        const response = yield API.put(`/customers/123`).set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("CONFLICT, cuando el nuevo email ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const { email } = yield (0, app_fabric_1.createCustomer)();
        const { _id: customerId } = yield (0, app_fabric_1.createCustomer)();
        const body = {
            name: "Omar Miranda",
            email,
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username: "omar123",
            country: "Perú",
        };
        const response = yield API.put(`/customers/${customerId}`)
            .set(token)
            .send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.CONFLICT);
    }));
    test("CONFLICT, cuando el nuevo username ya existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const [{ username }, { _id: customerId }] = yield Promise.all([
            (0, app_fabric_1.createUser)(),
            (() => __awaiter(void 0, void 0, void 0, function* () {
                const { _id: userId } = yield (0, app_fabric_1.createUser)();
                return (0, app_fabric_1.createCustomer)({ userId });
            }))(),
        ]);
        const body = {
            name: "Omar Miranda",
            email: "comidev.contacto@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username,
            country: "Perú",
        };
        const response = yield API.put(`/customers/${customerId}`)
            .set(token)
            .send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.CONFLICT);
    }));
    test("OK, cuando se actualiza correctamente", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        yield mongodb_2.default.deleteMany({});
        const [{ _id: userId }, { _id: countryId }] = yield Promise.all([
            (0, app_fabric_1.createUser)(),
            (0, app_fabric_1.createCountry)(),
        ]);
        const { _id: customerId } = yield (0, app_fabric_1.createCustomer)({ userId, countryId });
        const body = {
            name: "Omar Miranda",
            email: "comidev.contacto@gmail.com",
            photoUrl: "foto de perfil",
            gender: "Masculino",
            dateOfBirth: new Date(2000, 2, 11),
            username: "comidev123",
            country: "Perú",
        };
        const response = yield API.put(`/customers/${customerId}`)
            .set(token)
            .send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
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
    }));
});
afterAll(() => {
    mongoose_1.default.disconnect();
    app_1.server.close();
});
