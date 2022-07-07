"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToken = void 0;
const jwt_1 = require("../utils/jwt");
const handleHttpException_1 = require("./handleHttpException");
const handleToken = (req, _res, next) => {
    try {
        const token = req.get("Authorization");
        if (token) {
            const date = (0, jwt_1.verify)(token);
            req.user = date;
            next();
        }
        else {
            const message = "Falta el token!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.UNAUTHORIZED, message);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.handleToken = handleToken;
