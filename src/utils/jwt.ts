import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpException, HttpStatus } from "../midlewares/handleHttpException";

dotenv.config();
const SECRET: string = process.env.SECRET || "comidev";
const TOKEN_EXPIRATION_IN_SECONDS: string =
    process.env.TOKEN_EXPIRATION_IN_SECONDS || "1800";
const BEARER = "bearer ";
const ISSUER = "comidev";

export interface Payload {
    id: string;
    username: string;
    roles: string[];
}

export interface Tokens {
    access_token: string;
    refresh_token: string;
}

const createToken = (payload: Payload, extraTimeInSeconds: number = 0) => {
    const expiresIn = Number(TOKEN_EXPIRATION_IN_SECONDS) + extraTimeInSeconds;
    const subject = payload.username;
    const issuer = ISSUER;

    return jsonwebtoken.sign(payload, SECRET, { expiresIn, subject, issuer });
};

export const createTokens = (payload: Payload): Tokens => {
    const accessToken = createToken(payload);
    const refreshToken = createToken(payload, 1800); //* 5 min extra
    return { access_token: accessToken, refresh_token: refreshToken };
};

export const isBearer = (bearerToken: string) =>
    Boolean(bearerToken) &&
    bearerToken.toLowerCase().startsWith(BEARER) &&
    bearerToken.split(".").length === 3;

export const verify = (bearerToken: string): Payload => {
    if (!isBearer(bearerToken)) {
        throw HttpException(HttpStatus.UNAUTHORIZED, "Token is NOT Bearer!");
    }
    try {
        const token = bearerToken.substring(BEARER.length);
        const user = jsonwebtoken.verify(token, SECRET) as Payload;

        if (!user.id || !user.username || !user.roles) {
            throw new Error("objeto del token inválido");
        }

        return { id: user.id, username: user.username, roles: user.roles };
    } catch (error: any) {
        const message = `Token - ${error.message}`;
        throw HttpException(HttpStatus.UNAUTHORIZED, message);
    }
};
