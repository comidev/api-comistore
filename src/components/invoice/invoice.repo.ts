import { InvoiceItemDB } from "../invoice-item/dto";
import { ProductDB } from "../product/dto";
import { InvoiceDB } from "./dto";
import invoiceModel from "./model/mongodb";

export default {
    findAll: async () => {
        const invoicesDB = await invoiceModel.find({}).populate<{
            invoiceItems: [
                Omit<InvoiceItemDB, "product"> & {
                    product: ProductDB;
                }
            ];
        }>({
            path: "invoiceItems",
            populate: { path: "product" },
        });
        return invoicesDB;
    },

    findByCustomerId: async (id: string) => {
        const invoicesDB = await invoiceModel.find({ customer: id }).populate<{
            invoiceItems: [
                Omit<InvoiceItemDB, "product"> & {
                    product: ProductDB;
                }
            ];
        }>({
            path: "invoiceItems",
            populate: { path: "product" },
        });
        return invoicesDB;
    },

    save: async (invoice: InvoiceDB) => {
        await invoiceModel.create(invoice);
    },
};
