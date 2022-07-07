"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnectMongoDB = () => {
    const { DB_URI, DB_URI_TEST, NODE_ENV } = process.env;
    const dbURI = NODE_ENV === "test" ? DB_URI_TEST : DB_URI;
    mongoose_1.default.connect(dbURI || "", (err) => {
        if (!err) {
            console.log("Conexión correcta :D");
        }
        else {
            console.log("Conexión inccorrect :(");
        }
    });
};
exports.dbConnectMongoDB = dbConnectMongoDB;
