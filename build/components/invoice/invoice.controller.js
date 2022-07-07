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
const validator_1 = require("./dto/validator");
const invoice_service_1 = __importDefault(require("./invoice.service"));
const router = (0, express_1.Router)();
const findAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invoices = yield invoice_service_1.default.findAll();
    res.status(invoices.length === 0 ? 204 : 200);
    res.send(invoices);
});
const findByCustomerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    const invoices = yield invoice_service_1.default.findByCustomerId(customerId);
    res.status(invoices.length === 0 ? 204 : 200);
    res.send(invoices);
});
const save = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceReq = req.body;
    yield invoice_service_1.default.save(invoiceReq);
    res.status(201);
    res.send();
});
router.get("", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.ADMIN), (0, controller_1.tryOrError)(findAll));
router.get("/customer/:id", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.CLIENTE), (0, controller_1.tryOrError)(findByCustomerId));
router.post("", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.CLIENTE), validator_1.invoiceReqValid, (0, controller_1.tryOrError)(save));
exports.default = { router };
