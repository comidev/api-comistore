"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHttpException = exports.HttpException = exports.HttpStatus = void 0;
const { ERROR_SPLIT } = process.env;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBBIDEN"] = 403] = "FORBBIDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(HttpStatus = exports.HttpStatus || (exports.HttpStatus = {}));
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
const HttpException = (status, message) => {
    new Error(`${status}${ERROR_SPLIT}${message}`);
};
exports.HttpException = HttpException;
const handleHttpException = (error, req, res, _next) => {
    var _a, _b;
    const path = `${req.method} - ${req.url}`;
    if (error instanceof Array) {
        res.status(400);
        res.send({
            error: "400 - BAD REQUEST - VALIDATION",
            message: error,
            path,
        });
    }
    else if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes(ERROR_SPLIT || "")) {
        const [status, message] = error.message.split(ERROR_SPLIT || "");
        const STATUS = Number(status);
        const StatusName = (_b = HttpStatusName.find((item) => item.status === STATUS)) === null || _b === void 0 ? void 0 : _b.name;
        res.status(STATUS);
        res.send({
            error: `${STATUS} - ${StatusName}`,
            message,
            path,
        });
    }
    else {
        res.status(400);
        res.send({
            error: "400 - BAD REQUEST - ERROR",
            message: error.message || "Error!",
            path,
        });
    }
};
exports.handleHttpException = handleHttpException;
