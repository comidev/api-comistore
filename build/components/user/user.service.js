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
const handleHttpException_1 = require("../../midlewares/handleHttpException");
const role_repo_1 = __importStar(require("../role/role.repo"));
const password_1 = require("../../utils/password");
const user_repo_1 = __importDefault(require("./user.repo"));
const jwt_1 = require("../../utils/jwt");
const adapterUserRes = (item) => {
    const { username } = item;
    return { username };
};
const save = (user, roleName) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: roleId } = yield role_repo_1.default.findOrSave(roleName);
    const password = yield (0, password_1.encrypt)(user.password);
    const userNew = {
        username: user.username,
        password,
        roles: [roleId],
    };
    try {
        return yield user_repo_1.default.save(userNew);
    }
    catch (e) {
        const message = `El username ya existe ${userNew.username}`;
        throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.CONFLICT, message);
    }
});
exports.default = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        const usersDB = yield user_repo_1.default.findAll();
        return usersDB.map(adapterUserRes);
    }),
    saveAdmin: (user) => __awaiter(void 0, void 0, void 0, function* () {
        const userDB = yield save(user, role_repo_1.RoleName.ADMIN);
        return adapterUserRes(userDB);
    }),
    saveClient: (user) => __awaiter(void 0, void 0, void 0, function* () {
        const userDB = yield save(user, role_repo_1.RoleName.CLIENTE);
        return userDB;
    }),
    existsUsername: (username) => __awaiter(void 0, void 0, void 0, function* () {
        const userDB = yield user_repo_1.default.findByUsername(username);
        return Boolean(userDB);
    }),
    updatePassword: (userId, passwords) => __awaiter(void 0, void 0, void 0, function* () {
        let userDB = null;
        try {
            userDB = yield user_repo_1.default.findById(userId);
            if (!userDB)
                throw new Error();
        }
        catch (e) {
            const message = `El usuario no existe!`;
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
        const areEqual = yield (0, password_1.compare)(passwords.currentPassword, userDB.password);
        if (!areEqual) {
            const message = `Password incorrecto!!!`;
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.UNAUTHORIZED, message);
        }
        yield user_repo_1.default.update(userId, { password: passwords.newPassword });
    }),
    login: (user) => __awaiter(void 0, void 0, void 0, function* () {
        const userDB = yield user_repo_1.default.findByUsername(user.username);
        if (!userDB) {
            const message = "Username y/o password incorrecto(s)";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.UNAUTHORIZED, message);
        }
        const areEqual = yield (0, password_1.compare)(user.password, userDB.password);
        if (!areEqual) {
            const message = "Username y/o password incorrecto(s)";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.UNAUTHORIZED, message);
        }
        const roles = userDB.roles.map((item) => item.name);
        //TODO: Inicia sesión
        return (0, jwt_1.createTokens)({
            id: userDB._id.toJSON(),
            username: userDB.username,
            roles,
        });
    }),
    tokenRefresh: (tokenRefresh) => __awaiter(void 0, void 0, void 0, function* () {
        if (!tokenRefresh) {
            const message = "Debe enviar un token!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.BAD_REQUEST, message);
        }
        if (!(0, jwt_1.isBearer)(tokenRefresh)) {
            const message = "Token inválido!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.UNAUTHORIZED, message);
        }
        const payload = (0, jwt_1.verify)(tokenRefresh);
        //TODO: Actualizamos sus tokesns :D
        return (0, jwt_1.createTokens)(payload);
    }),
    tokenValidate: (token) => __awaiter(void 0, void 0, void 0, function* () {
        if (!token) {
            const message = "Debe enviar un token!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.UNAUTHORIZED, message);
        }
        try {
            (0, jwt_1.verify)(token);
            return true;
        }
        catch (e) {
            return false;
        }
    }),
    updateUsername: (usernamePrev, usernameNext) => __awaiter(void 0, void 0, void 0, function* () {
        yield user_repo_1.default.updateByUsername(usernamePrev, { username: usernameNext });
    }),
};
