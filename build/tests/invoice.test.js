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
const mongodb_1 = __importDefault(require("../components/invoice/model/mongodb"));
const handleHttpException_1 = require("../midlewares/handleHttpException");
const mongoose_1 = __importDefault(require("mongoose"));
const app_fabric_1 = require("./app-fabric");
const role_repo_1 = require("../components/role/role.repo");
dotenv_1.default.config();
const API = (0, supertest_1.default)(app_1.default);
const createInvoiceReal = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: productId, price, name, photoUrl, description: des, } = yield (0, app_fabric_1.createProduct)();
    const { _id: invoiceItemId, quantity } = yield (0, app_fabric_1.createInvoiceItem)({ productId });
    const invoiceItems = [
        { quantity, price, name, photoUrl, description: des },
    ];
    const { description, total } = yield (0, app_fabric_1.createInvoice)({
        invoiceItemId,
        customerId,
    });
    return { description, total, invoiceItems };
});
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongodb_1.default.deleteMany({});
}));
describe("GET, /invoices", () => {
    test("NO CONTENT, cuando no hay ninguna compra", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const response = yield API.get("/invoices").set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NO_CONTENT);
    }));
    test("OK, cuando no hay al menos una compra", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.ADMIN);
        const invoiceReal = yield createInvoiceReal();
        const response = yield API.get("/invoices").set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([invoiceReal]);
    }));
});
describe("GET, /invoices/customer/:id", () => {
    test("NOT FOUND, cuando el ID no es correcto", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const response = yield API.get(`/invoices/customer/123`).set(token).send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("NO CONTENT, cuando el cliente no tiene compras", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const { _id: customerId } = yield (0, app_fabric_1.createCustomer)();
        const response = yield API.get(`/invoices/customer/${customerId}`)
            .set(token)
            .send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NO_CONTENT);
    }));
    test("OK, cuando el cliente tiene al menos una compra", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const { _id: customerId } = yield (0, app_fabric_1.createCustomer)();
        const invoiceReal = yield createInvoiceReal(customerId);
        const response = yield API.get(`/invoices/customer/${customerId}`)
            .set(token)
            .send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([invoiceReal]);
    }));
});
describe("POST, /invoices", () => {
    test("BAD REQUEST, cuando no el body está vacío", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const body = {};
        const response = yield API.post("/invoices").set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("BAD REQUEST, cuando hay error de validación", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const body = {
            customer: "123",
            invoiceItems: [],
        };
        const response = yield API.post("/invoices").set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.BAD_REQUEST);
    }));
    test("NOT FOUND, cuando el cliente no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const body = {
            description: "Descripción",
            customer: "123",
            invoiceItems: [{ quantity: 3, product: "123" }],
        };
        const response = yield API.post("/invoices").set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("NOT FOUND, cuando un producto no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const { _id: customerId } = yield (0, app_fabric_1.createCustomer)();
        const body = {
            description: "Descripción",
            customer: customerId,
            invoiceItems: [{ quantity: 3, product: "123" }],
        };
        const response = yield API.post("/invoices").set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NOT_FOUND);
    }));
    test("CREATED, cuando se registra la compra correctamente", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield (0, app_fabric_1.createTokensByRoles)(role_repo_1.RoleName.CLIENTE);
        const { _id: productId } = yield (0, app_fabric_1.createProduct)();
        const { _id: customerId } = yield (0, app_fabric_1.createCustomer)();
        const body = {
            description: "Descripción",
            customer: customerId,
            invoiceItems: [{ quantity: 3, product: productId }],
        };
        const response = yield API.post("/invoices").set(token).send(body);
        expect(response.status).toBe(handleHttpException_1.HttpStatus.CREATED);
    }));
});
afterAll(() => {
    mongoose_1.default.disconnect();
    app_1.server.close();
});
