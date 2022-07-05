import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateResults = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        validationResult(req).throw();
        next();
    } catch (e: any) {
        const error = e.errors;
        next(error);
    }
};
