import countryModel from "./model/mongodb";

export default {
    findAll: async () => {
        const countries = await countryModel.find({});
        return countries;
    },
    findById: async (id: string) => {
        const country = await countryModel.findById(id);
        return country;
    },
    findOrSave: async (name: string) => {
        const country = { name };
        const countryDB =
            (await countryModel.findOne(country)) ||
            (await countryModel.create(country));
        return countryDB;
    },
};
