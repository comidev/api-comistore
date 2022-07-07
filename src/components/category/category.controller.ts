import { Router } from "express";
import { Controller, tryOrError } from "../../utils/controller";
import categoryService from "./category.service";
import { CategoryRes } from "./dto";

const router = Router();

const findAll: Controller = async (_req, res) => {
    const categories: CategoryRes[] = await categoryService.findAll();
    res.status(categories.length === 0 ? 204 : 200);
    res.send(categories);
};

router.get("", tryOrError(findAll));

export default { router };
