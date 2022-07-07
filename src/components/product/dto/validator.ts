import { check } from "express-validator";
import { validateResults } from "../../../utils/validator";

export const productReqValid = [
    check(["name", "photoUrl", "description"])
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 3 }),
    check(["stock", "price"]).exists().notEmpty().isNumeric(),
    validateResults,
];
