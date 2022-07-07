"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const index_1 = __importDefault(require("./routers/index"));
const handle404_1 = require("./midlewares/handle404");
const handleHttpException_1 = require("./midlewares/handleHttpException");
const mongodb_1 = require("./config/mongodb");
//TODO: Carga el .ENV
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
//TODO: Acepta peticiones de dónde sea
app.use((0, cors_1.default)());
//TODO: Habilita el body
app.use(express_1.default.json());
//TODO: Inplementamos las rutas
app.use("", index_1.default);
app.use(handleHttpException_1.handleHttpException);
app.use(handle404_1.handle404);
(0, mongodb_1.dbConnectMongoDB)();
exports.server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});
exports.default = app;
