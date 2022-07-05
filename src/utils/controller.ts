import { NextFunction, Request, Response } from "express";

export type Controller = (req: Request, res: Response) => void;

export const tryOrError =
    (cb: Controller) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cb(req, res);
        } catch (error) {
            next(error);
        }
    };
