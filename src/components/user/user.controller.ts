import { Router } from "express";
import { Controller, tryOrError } from "../../utils/controller";
import { Tokens } from "../../utils/jwt";
import { UpdatePassword, UserRes, UserReq } from "./dto";
import {
    existsUsernameValid,
    saveUserValid,
    updatePasswordValid,
} from "./dto/validator";
import userService from "./user.service";

const controller = Router();

const findAll: Controller = async (_req, res) => {
    const users: UserRes[] = await userService.findAll();
    res.status(users.length === 0 ? 204 : 200);
    res.send(users);
};

const save: Controller = async (req, res) => {
    const userReq: UserReq = req.body;
    const user: UserRes = await userService.saveAdmin(userReq);
    res.status(201);
    res.send(user);
};

const existsUsername: Controller = async (req, res) => {
    const username: string = req.body.username;
    const exists = await userService.existsUsername(username);
    res.status(200);
    res.send({ exists });
};

const updatePassword: Controller = async (req, res) => {
    const userId = req.params.id;
    const passwords: UpdatePassword = req.body;
    await userService.updatePassword(userId, passwords);
    res.status(200);
    res.send();
};

const login: Controller = async (req, res) => {
    const userReq: UserReq = req.body;
    const tokens: Tokens = await userService.login(userReq);
    res.status(200);
    res.send(tokens);
};

const tokenRefresh: Controller = async (req, res) => {
    const token: string = req.get("Authorization") || "";
    const tokens: Tokens = await userService.tokenRefresh(token);
    res.status(200);
    res.send(tokens);
};

const tokenValidate: Controller = async (req, res) => {
    const token: string = req.get("Authorization") || "";
    const isValid = await userService.tokenValidate(token);
    res.status(200);
    res.send({ isValid });
};

controller.get("", tryOrError(findAll));
controller.post("", saveUserValid, tryOrError(save));
controller.post("/username", existsUsernameValid, tryOrError(existsUsername));
controller.patch("/:id/password", updatePasswordValid, tryOrError(updatePassword));
controller.post("/login", saveUserValid, tryOrError(login));
controller.post("/token/refresh", tryOrError(tokenRefresh));
controller.post("/token/validate", tryOrError(tokenValidate));

export default { router: controller };
