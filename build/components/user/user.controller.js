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
const user_service_1 = __importDefault(require("./user.service"));
const controller = (0, express_1.Router)();
const findAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.default.findAll();
    res.status(users.length === 0 ? 204 : 200);
    res.send(users);
});
const save = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userReq = req.body;
    const user = yield user_service_1.default.saveAdmin(userReq);
    res.status(201);
    res.send(user);
});
const existsUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const exists = yield user_service_1.default.existsUsername(username);
    res.status(200);
    res.send({ exists });
});
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const passwords = req.body;
    yield user_service_1.default.updatePassword(userId, passwords);
    res.status(200);
    res.send();
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userReq = req.body;
    const tokens = yield user_service_1.default.login(userReq);
    res.status(200);
    res.send(tokens);
});
const tokenRefresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get("Authorization") || "";
    const tokens = yield user_service_1.default.tokenRefresh(token);
    res.status(200);
    res.send(tokens);
});
const tokenValidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get("Authorization") || "";
    const isValid = yield user_service_1.default.tokenValidate(token);
    res.status(200);
    res.send({ isValid });
});
controller.get("", (0, controller_1.tryOrError)(findAll));
controller.post("", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.ADMIN), validator_1.saveUserValid, (0, controller_1.tryOrError)(save));
controller.post("/username", validator_1.existsUsernameValid, (0, controller_1.tryOrError)(existsUsername));
controller.patch("/:id/password", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.CLIENTE), validator_1.updatePasswordValid, (0, controller_1.tryOrError)(updatePassword));
controller.post("/login", validator_1.saveUserValid, (0, controller_1.tryOrError)(login));
controller.post("/token/refresh", handleToken_1.handleToken, (0, handleRoles_1.handleRoles)(role_repo_1.RoleName.CLIENTE), (0, controller_1.tryOrError)(tokenRefresh));
controller.post("/token/validate", (0, controller_1.tryOrError)(tokenValidate));
exports.default = { router: controller };
