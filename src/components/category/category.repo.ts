import categoryModel from "./model/mongodb";

export default {
    findAll: async () => {
        const categories = await categoryModel.find({});
        return categories;
    },
    findByName: async (name: string) => {
        const category = await categoryModel.findOne({ name });
        return category;
    },
};
