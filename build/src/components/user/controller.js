"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_1 = require("./service");
const router = (0, express_1.Router)();
//TODO: findAll
router.get("", (req, res, next) => {
    try {
        const users = (0, service_1.findAll)();
        res.status(200);
        res.send(users);
    }
    catch (error) {
        next(error);
    }
});
//TODO: findById
router.get("/:id", (req, res, next) => { });
//TODO: register
router.post("", (req, res, next) => { });
//TODO: login
router.post("/login", (req, res, next) => { });
//TODO: existsUsername
router.post("/username", (req, res, next) => { });
//TODO: updatePassword
router.post("/:id/password", (req, res, next) => { });
exports.default = router;
