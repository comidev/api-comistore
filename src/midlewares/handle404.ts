import { NextFunction, Request, Response } from "express";

export const handle404 = (req: Request, res: Response, _next: NextFunction) => {
    res.status(404);
    res.send({
        error: "404 - NOT FOUND",
        message: "Esta ruta no está registrada",
        path: `${req.method} - ${req.url}`,
    });
};
