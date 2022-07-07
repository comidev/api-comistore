"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResults = void 0;
const express_validator_1 = require("express-validator");
const validateResults = (req, _res, next) => {
    try {
        (0, express_validator_1.validationResult)(req).throw();
        next();
    }
    catch (e) {
        const error = e.errors;
        next(error);
    }
};
exports.validateResults = validateResults;
