"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle404 = void 0;
const handle404 = (req, res, _next) => {
    res.status(404);
    res.send({
        error: "404 - NOT FOUND",
        message: "Esta ruta no está registrada",
        path: `${req.method} - ${req.url}`,
    });
};
exports.handle404 = handle404;
