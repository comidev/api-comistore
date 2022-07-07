"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordValid = exports.existsUsernameValid = exports.saveUserValid = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("../../../utils/validator");
exports.saveUserValid = [
    (0, express_validator_1.check)(["username", "password"]).exists().notEmpty().isLength({ min: 3 }),
    validator_1.validateResults,
];
exports.existsUsernameValid = [
    (0, express_validator_1.check)("username").exists().notEmpty().isLength({ min: 3 }),
    validator_1.validateResults,
];
exports.updatePasswordValid = [
    (0, express_validator_1.check)(["currentPassword", "newPassword"])
        .exists()
        .notEmpty()
        .isLength({ min: 3 }),
    validator_1.validateResults,
];
