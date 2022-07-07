import invoiceItemModel from "./model/mongodb";

export default {
    save: async (quantity: number, productId: any) => {
        const invoiceItemDB = await invoiceItemModel.create({
            quantity,
            product: productId,
        });
        return invoiceItemDB;
    },
};
