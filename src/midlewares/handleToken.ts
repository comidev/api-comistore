import { NextFunction, Request, Response } from "express";
import { Payload, verify } from "../utils/jwt";
import { HttpException, HttpStatus } from "./handleHttpException";

export const handleToken = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.get("Authorization");
        if (token) {
            const date: Payload = verify(token);
            req.user = date;
            next();
        } else {
            const message = "Falta el token!";
            throw HttpException(HttpStatus.UNAUTHORIZED, message);
        }
    } catch (error) {
        next(error);
    }
};
