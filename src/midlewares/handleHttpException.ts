import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const { ERROR_SPLIT } = process.env;

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBBIDEN = 403,
    NOT_FOUND = 404,
    NOT_ACCEPTABLE = 406,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

const HttpStatusName = [
    { status: 400, name: "BAD REQUEST" },
    { status: 401, name: "UNAUTHORIZED" },
    { status: 403, name: "FORBBIDEN" },
    { status: 404, name: "NOT FOUND" },
    { status: 406, name: "NOT ACCEPTABLE" },
    { status: 409, name: "CONFLICT" },
    { status: 500, name: "INTERNAL SERVER ERROR" },
    { status: 503, name: "SERVICE UNAVAILABLE" },
];

export const HttpException = (status: HttpStatus, message: string) => {
    return new Error(`${status}${ERROR_SPLIT}${message}`);
};

export const handleHttpException = (
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const path = `${req.method} - ${req.url}`;

    if (error instanceof Array) {
        res.status(400);
        res.send({
            error: "400 - BAD REQUEST - VALIDATION",
            message: error,
            path,
        });
    } else if (error.message?.includes(ERROR_SPLIT || "")) {
        const [status, message] = error.message.split(ERROR_SPLIT || "");
        const STATUS = Number(status);
        const StatusName = HttpStatusName.find(
            (item) => item.status === STATUS
        )?.name;

        res.status(STATUS);
        res.send({
            error: `${STATUS} - ${StatusName}`,
            message,
            path,
        });
    } else {
        res.status(400);
        res.send({
            error: "400 - BAD REQUEST - ERROR",
            message: error.message || "Error!",
            path,
        });
    }
};
