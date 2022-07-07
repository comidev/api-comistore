import { check } from "express-validator";
import { validateResults } from "../../../utils/validator";

export const invoiceReqValid = [
    check(["description", "customer", "invoiceItems"]).exists().notEmpty(),
    check("description").isString(),
    check("invoiceItems").isArray({ min: 1 }),
    validateResults,
];
