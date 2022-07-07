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
const product_service_1 = __importDefault(require("./product.service"));
const express_1 = require("express");
const controller_1 = require("../../utils/controller");
const validator_1 = require("./dto/validator");
const handleToken_1 = require("../../midlewares/handleToken");
const handleRoles_1 = require("../../midlewares/handleRoles");
const role_repo_1 = require("../role/role.repo");
const router = (0, express_1.Router)();
const findAllOrFields = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const name = ((_a = req.query.name) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    const categoryName = ((_b = req.query.categoryName) === null || _b === void 0 ? void 0 : _b.toString()) || "";
    const products = yield product_service_1.default.findAllOrFields({
        name,
        categoryName,
    });
    res.status(products.length === 0 ? 204 : 200);
    res.send(products);
});
const findById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield product_service_1.default.findById(id);
    res.status(200);
    res.send(product);
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const productReq = req.body;
    const product = yield product_service_1.default.update(id, productReq);
    res.status(200);
    res.send(product);
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield product_service_1.default.deleteById(id);
    res.status(200);
    res.send();
});
router.get("", (0, controller_1.tryOrError)(findAllOrFields));
router.get("/:id", (0, controller_1.tryOrError)(findById));
router.put("/:id", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.ADMIN), validator_1.productReqValid, (0, controller_1.tryOrError)(update));
router.delete("/:id", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.ADMIN), (0, controller_1.tryOrError)(deleteById));
exports.default = { router };
