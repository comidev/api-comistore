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
const mongodb_1 = __importDefault(require("../components/country/model/mongodb"));
const handleHttpException_1 = require("../midlewares/handleHttpException");
const mongoose_1 = __importDefault(require("mongoose"));
const app_fabric_1 = require("./app-fabric");
dotenv_1.default.config();
const API = (0, supertest_1.default)(app_1.default);
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield mongodb_1.default.deleteMany({}); }));
describe("GET, /countries", () => {
    test("NO CONTENT, cuando no hay paises", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield API.get("/countries").send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.NO_CONTENT);
    }));
    test("OK, cuando no hay al menos un país", () => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = yield (0, app_fabric_1.createCountry)();
        const response = yield API.get("/countries").send();
        expect(response.status).toBe(handleHttpException_1.HttpStatus.OK);
        expect(response.body).toStrictEqual([{ name }]);
    }));
});
afterAll(() => {
    mongoose_1.default.disconnect();
    app_1.server.close();
});
