import { NextFunction, Request, Response } from "express";
import { RoleName } from "../components/role/role.repo";
import { HttpException, HttpStatus } from "./handleHttpException";

const handleRole =
    (allowedRoles: RoleName[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        try {
            const { roles } = req.user;

            const isPermited = allowedRoles.some((roleAllowed) =>
                roles.includes(roleAllowed)
            );

            if (!isPermited) {
                const message = "No tiene autorización >:(";
                throw HttpException(HttpStatus.FORBBIDEN, message);
            }
            next();
        } catch (error) {
            next(error);
        }
    };

export const handleRoles = (...roles: RoleName[]) => handleRole(roles);
