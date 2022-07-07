"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRoles = void 0;
const handleHttpException_1 = require("./handleHttpException");
const handleRole = (allowedRoles) => (req, _res, next) => {
    try {
        const { roles } = req.user;
        const isPermited = allowedRoles.some((roleAllowed) => roles.includes(roleAllowed));
        if (!isPermited) {
            const message = "No tiene autorización >:(";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.FORBBIDEN, message);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
const handleRoles = (...roles) => handleRole(roles);
exports.handleRoles = handleRoles;
