"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleHttpException_1 = require("../../midlewares/handleHttpException");
const customer_repo_1 = __importDefault(require("../customer/customer.repo"));
const invoice_item_repo_1 = __importDefault(require("../invoice-item/invoice-item.repo"));
const product_repo_1 = __importDefault(require("../product/product.repo"));
const invoice_repo_1 = __importDefault(require("./invoice.repo"));
const adapterInvoiceItemRes = (item) => {
    const { quantity, product } = item;
    const { price, name, photoUrl, description } = product;
    return { quantity, price, name, photoUrl, description };
};
const adapterInvoiceRes = (item) => {
    const { description, total, invoiceItems: invoiceItmsDB } = item;
    const invoiceItems = invoiceItmsDB.map(adapterInvoiceItemRes);
    return { description, total, invoiceItems };
};
exports.default = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        const invoicesDB = yield invoice_repo_1.default.findAll();
        return invoicesDB.map(adapterInvoiceRes);
    }),
    findByCustomerId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customerDB = yield customer_repo_1.default.findById(id);
            if (!customerDB)
                throw new Error();
        }
        catch (e) {
            const message = "Cliente no encontrado";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
        const invoicesDB = yield invoice_repo_1.default.findByCustomerId(id);
        return invoicesDB.map(adapterInvoiceRes);
    }),
    save: (invoiceReq) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customerDB = yield customer_repo_1.default.findById(invoiceReq.customer);
            if (!customerDB)
                throw new Error();
        }
        catch (e) {
            const message = "Cliente no encontrado";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
        let total = 0;
        const invoiceItems = [];
        for (const item of invoiceReq.invoiceItems) {
            const { quantity, product: productId } = item;
            let price = 0;
            let stock = 0;
            try {
                const productDB = yield product_repo_1.default.findById(productId);
                if (!productDB)
                    throw Error();
                price = productDB.price;
                stock = productDB.stock;
            }
            catch (e) {
                const message = "Producto no encontrado!!";
                throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
            }
            total += quantity * price;
            const [{ _id: invoiceItemId }] = yield Promise.all([
                invoice_item_repo_1.default.save(quantity, productId),
                product_repo_1.default.updateStock(productId, stock - quantity),
            ]);
            invoiceItems.push(invoiceItemId);
        }
        const invoiceDB = {
            description: invoiceReq.description,
            total,
            customer: invoiceReq.customer,
            invoiceItems,
        };
        yield invoice_repo_1.default.save(invoiceDB);
    }),
};
