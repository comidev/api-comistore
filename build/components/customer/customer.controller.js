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
const express_1 = require("express");
const handleRoles_1 = require("../../midlewares/handleRoles");
const handleToken_1 = require("../../midlewares/handleToken");
const controller_1 = require("../../utils/controller");
const role_repo_1 = require("../role/role.repo");
const customer_service_1 = __importDefault(require("./customer.service"));
const validator_1 = require("./dto/validator");
const router = (0, express_1.Router)();
const findAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customers = yield customer_service_1.default.findAll();
    res.status(customers.length === 0 ? 204 : 200);
    res.send(customers);
});
const findById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const customer = yield customer_service_1.default.findById(id);
    res.status(200);
    res.send(customer);
});
const save = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerReq = req.body;
    const customer = yield customer_service_1.default.save(customerReq);
    res.status(201);
    res.send(customer);
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield customer_service_1.default.deleteById(id);
    res.status(200);
    res.send();
});
const existsEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const exists = yield customer_service_1.default.existsEmail(email);
    res.status(200);
    res.send({ exists });
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const customerReq = req.body;
    const customerRes = yield customer_service_1.default.update(id, customerReq);
    res.status(200);
    res.send(customerRes);
});
router.get("", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.ADMIN), (0, controller_1.tryOrError)(findAll));
router.get("/:id", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.CLIENTE), (0, controller_1.tryOrError)(findById));
router.post("", validator_1.customerReqValid, (0, controller_1.tryOrError)(save));
router.delete("/:id", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.CLIENTE), (0, controller_1.tryOrError)(deleteById));
router.post("/email", validator_1.existsEmailValid, (0, controller_1.tryOrError)(existsEmail));
router.put("/:id", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.CLIENTE), validator_1.customerUpdValid, (0, controller_1.tryOrError)(update));
exports.default = { router };
