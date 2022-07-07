import { CountryDB } from "../country/dto";
import { UserDB } from "../user/dto";
import { CustomerDB } from "./dto";
import customerModel from "./model/mongodb";

export default {
    findAll: async () => {
        const customersDB = await customerModel
            .find({})
            .populate<{ user: UserDB; country: CountryDB }>(["user", "country"]);
        return customersDB;
    },

    findById: async (id: any) => {
        const customerDB = await customerModel
            .findById(id)
            .populate<{ user: UserDB; country: CountryDB }>(["user", "country"]);
        return customerDB;
    },
    findByEmail: async (email: string) => {
        const customerDB = await customerModel.findOne({ email });
        return customerDB;
    },
    save: async (customer: CustomerDB) => {
        const customerDB = (await customerModel.create(customer)).populate<{
            user: UserDB;
            country: CountryDB;
        }>(["user", "country"]);
        return customerDB;
    },
    deleteById: async (id: string) => {
        await customerModel.findByIdAndDelete(id);
    },
    update: async (id: string, updateFilter: object) => {
        await customerModel.findByIdAndUpdate(id, updateFilter);
    },
};
