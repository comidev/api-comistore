import { check } from "express-validator";
import { validateResults } from "../../../utils/validator";

export const saveUserValid = [
    check(["username", "password"]).exists().notEmpty().isLength({ min: 3 }),
    validateResults,
];

export const existsUsernameValid = [
    check("username").exists().notEmpty().isLength({ min: 3 }),
    validateResults,
];

export const updatePasswordValid = [
    check(["currentPassword", "newPassword"])
        .exists()
        .notEmpty()
        .isLength({ min: 3 }),
    validateResults,
];
