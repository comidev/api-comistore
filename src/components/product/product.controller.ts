import productService from "./product.service";
import { Router } from "express";
import { Controller, tryOrError } from "../../utils/controller";
import { ProductReq, ProductRes } from "./dto";
import { productReqValid } from "./dto/validator";

const router = Router();



const findAllOrFields: Controller = async (req, res) => {
    const name: string = req.query.name?.toString() || "";
    const categoryName: string = req.query.categoryName?.toString() || "";

    const products: ProductRes[] = await productService.findAllOrFields({
        name,
        categoryName,
    });

    res.status(products.length === 0 ? 204 : 200);
    res.send(products);
};

const findById: Controller = async (req, res) => {
    const id: string = req.params.id;

    const product: ProductRes = await productService.findById(id);

    res.status(200);
    res.send(product);
};

const update: Controller = async (req, res) => {
    const id: string = req.params.id;
    const productReq: ProductReq = req.body;

    const product: ProductRes = await productService.update(id, productReq);

    res.status(200);
    res.send(product);
};

const deleteById: Controller = async (req, res) => {
    const id: string = req.params.id;

    await productService.deleteById(id);

    res.status(200);
    res.send();
};

router.get("", tryOrError(findAllOrFields));
router.get("/:id", tryOrError(findById));
router.put("/:id", productReqValid, tryOrError(update));
router.delete("/:id", tryOrError(deleteById));

export default { router };
