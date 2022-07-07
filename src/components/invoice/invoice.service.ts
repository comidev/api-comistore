import { HttpException, HttpStatus } from "../../midlewares/handleHttpException";
import customerRepo from "../customer/customer.repo";
import { InvoiceItemRes } from "../invoice-item/dto";
import invoiceItemRepo from "../invoice-item/invoice-item.repo";
import productRepo from "../product/product.repo";
import { InvoiceDB, InvoiceReq, InvoiceRes } from "./dto";
import invoiceRepo from "./invoice.repo";

const adapterInvoiceItemRes = (item: any): InvoiceItemRes => {
    const { quantity, product } = item;
    const { price, name, photoUrl, description } = product;
    return { quantity, price, name, photoUrl, description };
};

const adapterInvoiceRes = (item: any): InvoiceRes => {
    const { description, total, invoiceItems: invoiceItmsDB } = item;

    const invoiceItems: InvoiceItemRes[] = invoiceItmsDB.map(adapterInvoiceItemRes);

    return { description, total, invoiceItems };
};

export default {
    findAll: async (): Promise<InvoiceRes[]> => {
        const invoicesDB = await invoiceRepo.findAll();
        return invoicesDB.map(adapterInvoiceRes);
    },
    findByCustomerId: async (id: string): Promise<InvoiceRes[]> => {
        try {
            const customerDB = await customerRepo.findById(id);
            if (!customerDB) throw new Error();
        } catch (e) {
            const message = "Cliente no encontrado";
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }

        const invoicesDB = await invoiceRepo.findByCustomerId(id);
        return invoicesDB.map(adapterInvoiceRes);
    },

    save: async (invoiceReq: InvoiceReq) => {
        try {
            const customerDB = await customerRepo.findById(invoiceReq.customer);
            if (!customerDB) throw new Error();
        } catch (e) {
            const message = "Cliente no encontrado";
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }

        let total = 0;
        const invoiceItems = [];
        for (const item of invoiceReq.invoiceItems) {
            const { quantity, product: productId } = item;
            let price = 0;
            let stock = 0;
            try {
                const productDB = await productRepo.findById(productId);
                if (!productDB) throw Error();
                price = productDB.price;
                stock = productDB.stock;
            } catch (e) {
                const message = "Producto no encontrado!!";
                throw HttpException(HttpStatus.NOT_FOUND, message);
            }
            total += quantity * price;
            const [{ _id: invoiceItemId }] = await Promise.all([
                invoiceItemRepo.save(quantity, productId),
                productRepo.updateStock(productId, stock - quantity),
            ]);
            invoiceItems.push(invoiceItemId);
        }

        const invoiceDB: InvoiceDB = {
            description: invoiceReq.description,
            total,
            customer: invoiceReq.customer,
            invoiceItems,
        };

        await invoiceRepo.save(invoiceDB);
    },
};
