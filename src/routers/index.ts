import { Router } from "express";
import users from "../components/user/user.controller";

const router = Router();

router.use("/users", users.router);

export default router;
