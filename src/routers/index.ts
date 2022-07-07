import { Router } from "express";
import users from "../components/user/user.controller";
import categories from "../components/category/category.controller";
import products from "../components/product/product.controller";
import countries from "../components/country/country.controller";
import customers from "../components/customer/customer.controller";
import invoices from "../components/invoice/invoice.controller";

const router = Router();

router.use("/users", users.router);
router.use("/categories", categories.router);
router.use("/products", products.router);
router.use("/countries", countries.router);
router.use("/customers", customers.router);
router.use("/invoices", invoices.router);

export default router;
