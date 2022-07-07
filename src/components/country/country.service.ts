import countryRepo from "./country.repo";
import { CountryRes } from "./dto";

const adapterCountryRes = (item: any) => {
    const { name } = item;
    return { name };
};

export default {
    findAll: async (): Promise<CountryRes[]> => {
        const countriesDB = await countryRepo.findAll();
        
        return countriesDB.map(adapterCountryRes);
    },
};
