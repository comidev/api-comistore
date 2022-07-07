import { Router } from "express";
import { handleRoles } from "../../midlewares/handleRoles";
import { handleToken } from "../../midlewares/handleToken";
import { Controller, tryOrError } from "../../utils/controller";
import { RoleName } from "../role/role.repo";
import { InvoiceReq, InvoiceRes } from "./dto";
import { invoiceReqValid } from "./dto/validator";
import invoiceService from "./invoice.service";

const router = Router();

const findAll: Controller = async (_req, res) => {
    const invoices: InvoiceRes[] = await invoiceService.findAll();

    res.status(invoices.length === 0 ? 204 : 200);
    res.send(invoices);
};

const findByCustomerId: Controller = async (req, res) => {
    const customerId: string = req.params.id;

    const invoices: InvoiceRes[] = await invoiceService.findByCustomerId(customerId);

    res.status(invoices.length === 0 ? 204 : 200);
    res.send(invoices);
};

const save: Controller = async (req, res) => {
    const invoiceReq: InvoiceReq = req.body;

    await invoiceService.save(invoiceReq);

    res.status(201);
    res.send();
};

router.get("", handleToken, handleRoles(RoleName.ADMIN), tryOrError(findAll));

router.get(
    "/customer/:id",
    handleToken,
    handleRoles(RoleName.CLIENTE),
    tryOrError(findByCustomerId)
);

router.post(
    "",
    handleToken,
    handleRoles(RoleName.CLIENTE),
    invoiceReqValid,
    tryOrError(save)
);

export default { router };
