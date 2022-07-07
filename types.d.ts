import "express";
import "@types/express";
import "@types/express-serve-static-core";
import { Payload } from "./src/utils/jwt";

declare module "express" {
    export interface Request {
        user: Payload;
    }
}

declare module "@types/express" {
    export interface Request {
        user: Payload;
    }
}

declare module "@types/express-serve-static-core" {
    export interface Request {
        user: Payload;
    }
}
