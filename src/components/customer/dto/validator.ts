import { check } from "express-validator";
import { validateResults } from "../../../utils/validator";

export const customerReqValid = [
    check(["name", "email", "photoUrl", "gender", "dateOfBirth", "user", "country"])
        .exists()
        .notEmpty()
        .withMessage("Este campo debe existir!"),
    check(["name", "email", "photoUrl", "country"]).isString(),
    check("user").isObject(),
    check(["user.username", "user.password"])
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 3 }),
    validateResults,
];

export const existsEmailValid = [
    check("email").exists().notEmpty().isString(),
    validateResults,
];

export const customerUpdValid = [
    check([
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
    check(["name", "email", "photoUrl", "country", "username"]).isString(),
    check("username").isLength({ min: 3 }),
    validateResults,
];
