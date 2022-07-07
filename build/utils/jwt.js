"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.isBearer = exports.createTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const handleHttpException_1 = require("../midlewares/handleHttpException");
dotenv_1.default.config();
const SECRET = process.env.SECRET || "comidev";
const TOKEN_EXPIRATION_IN_SECONDS = process.env.TOKEN_EXPIRATION_IN_SECONDS || "1800";
const BEARER = "bearer ";
const ISSUER = "comidev";
const createToken = (payload, extraTimeInSeconds = 0) => {
    const expiresIn = Number(TOKEN_EXPIRATION_IN_SECONDS) + extraTimeInSeconds;
    const subject = payload.username;
    const issuer = ISSUER;
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn, subject, issuer });
};
const createTokens = (payload) => {
    const accessToken = createToken(payload);
    const refreshToken = createToken(payload, 1800); //* 5 min extra
    return { access_token: accessToken, refresh_token: refreshToken };
};
exports.createTokens = createTokens;
const isBearer = (bearerToken) => Boolean(bearerToken) &&
    bearerToken.toLowerCase().startsWith(BEARER) &&
    bearerToken.split(".").length === 3;
exports.isBearer = isBearer;
const verify = (bearerToken) => {
    if (!(0, exports.isBearer)(bearerToken)) {
        throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.UNAUTHORIZED, "Token is NOT Bearer!");
    }
    try {
        const token = bearerToken.substring(BEARER.length);
        const user = jsonwebtoken_1.default.verify(token, SECRET);
        if (!user.id || !user.username || !user.roles) {
            throw new Error("objeto del token inválido");
        }
        return { id: user.id, username: user.username, roles: user.roles };
    }
    catch (error) {
        const message = `Token - ${error.message}`;
        throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.UNAUTHORIZED, message);
    }
};
exports.verify = verify;
