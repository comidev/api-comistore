"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productReqValid = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("../../../utils/validator");
exports.productReqValid = [
    (0, express_validator_1.check)(["name", "photoUrl", "description"])
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 3 }),
    (0, express_validator_1.check)(["stock", "price"]).exists().notEmpty().isNumeric(),
    validator_1.validateResults,
];
