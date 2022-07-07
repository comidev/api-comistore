import categoryRepo from "./category.repo";
import { CategoryRes } from "./dto";

const adapterCategoryRes = (item: any): CategoryRes => {
    const name: string = item.name;
    return { name };
};

export default {
    findAll: async (): Promise<CategoryRes[]> => {
        const categoriesDB = await categoryRepo.findAll();

        return categoriesDB.map(adapterCategoryRes);
    },
};
