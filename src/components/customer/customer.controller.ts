import { Router } from "express";
import { Controller, tryOrError } from "../../utils/controller";
import customerService from "./customer.service";
import { CustomerReq, CustomerRes, CustomerUpdate } from "./dto";
import { customerReqValid, customerUpdValid, existsEmailValid } from "./dto/validator";

const router = Router();

const findAll: Controller = async (_req, res) => {
    const customers: CustomerRes[] = await customerService.findAll();

    res.status(customers.length === 0 ? 204 : 200);
    res.send(customers);
};

const findById: Controller = async (req, res) => {
    const id: string = req.params.id;

    const customer: CustomerRes = await customerService.findById(id);

    res.status(200);
    res.send(customer);
};

const save: Controller = async (req, res) => {
    const customerReq: CustomerReq = req.body;

    const customer: CustomerRes = await customerService.save(customerReq);

    res.status(201);
    res.send(customer);
};

const deleteById: Controller = async (req, res) => {
    const id: string = req.params.id;

    await customerService.deleteById(id);

    res.status(200);
    res.send();
};

const existsEmail: Controller = async (req, res) => {
    const email: string = req.body.email;

    const exists = await customerService.existsEmail(email);

    res.status(200);
    res.send({ exists });
};

const update: Controller = async (req, res) => {
    const id: string = req.params.id;
    const customerReq: CustomerUpdate = req.body;

    const customerRes: CustomerRes = await customerService.update(id, customerReq);

    res.status(200);
    res.send(customerRes);
};

router.get("", tryOrError(findAll));
router.get("/:id", tryOrError(findById));
router.post("", customerReqValid, tryOrError(save));
router.delete("/:id", tryOrError(deleteById));
router.post("/email", existsEmailValid, tryOrError(existsEmail));
router.put("/:id", customerUpdValid, tryOrError(update));

export default { router };
