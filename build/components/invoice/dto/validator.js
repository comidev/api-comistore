"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceReqValid = void 0;
const express_validator_1 = require("express-validator");
const validator_1 = require("../../../utils/validator");
exports.invoiceReqValid = [
    (0, express_validator_1.check)(["description", "customer", "invoiceItems"]).exists().notEmpty(),
    (0, express_validator_1.check)("description").isString(),
    (0, express_validator_1.check)("invoiceItems").isArray({ min: 1 }),
    validator_1.validateResults,
];
