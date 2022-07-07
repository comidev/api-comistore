"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerUpdValid = exports.existsEmailValid = exports.customerReqValid = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("../../../utils/validator");
exports.customerReqValid = [
    (0, express_validator_1.check)(["name", "email", "photoUrl", "gender", "dateOfBirth", "user", "country"])
        .exists()
        .notEmpty()
        .withMessage("Este campo debe existir!"),
    (0, express_validator_1.check)(["name", "email", "photoUrl", "country"]).isString(),
    (0, express_validator_1.check)("user").isObject(),
    (0, express_validator_1.check)(["user.username", "user.password"])
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 3 }),
    validator_1.validateResults,
];
exports.existsEmailValid = [
    (0, express_validator_1.check)("email").exists().notEmpty().isString(),
    validator_1.validateResults,
];
exports.customerUpdValid = [
    (0, express_validator_1.check)([
        "name",
        "email",
        "photoUrl",
        "gender",
        "dateOfBirth",
        "username",
        "country",
    ])
        .exists()
        .notEmpty()
        .withMessage("Este campo debe existir!"),
    (0, express_validator_1.check)(["name", "email", "photoUrl", "country", "username"]).isString(),
    (0, express_validator_1.check)("username").isLength({ min: 3 }),
    validator_1.validateResults,
];
