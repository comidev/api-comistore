import { CustomerDB, CustomerReq, CustomerRes, CustomerUpdate } from "./dto";
import { HttpException, HttpStatus } from "../../midlewares/handleHttpException";
import customerRepo from "./customer.repo";
import countryRepo from "../country/country.repo";
import userService from "../user/user.service";

export enum Gender {
    MALE = "Masculino",
    FEMALE = "Femenino",
    OTHER = "Otro",
}

const adapterCustomerRes = (item: any): CustomerRes => {
    const { _id, name, email, dateOfBirth, gender, photoUrl } = item;
    const { user: userDB, country: countryDB } = item;
    const { username } = userDB;
    const { name: country } = countryDB;

    return {
        id: _id.toJSON(),
        name,
        email,
        dateOfBirth,
        gender,
        photoUrl,
        username,
        country,
    };
};

const existsEmail = async (email: string) => {
    const customerDB = await customerRepo.findByEmail(email);
    return Boolean(customerDB);
};

export default {
    findAll: async (): Promise<CustomerRes[]> => {
        const customersDB = await customerRepo.findAll();

        return customersDB.map(adapterCustomerRes);
    },

    findById: async (id: string): Promise<CustomerRes> => {
        try {
            const customerDB = await customerRepo.findById(id);
            if (!customerDB) throw new Error();

            return adapterCustomerRes(customerDB);
        } catch (e) {
            const message = "El cliente no existe!";
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }
    },

    save: async (customerReq: CustomerReq): Promise<CustomerRes> => {
        const exists = await existsEmail(customerReq.email);
        if (exists) {
            const message = "El email ya existe!!!";
            throw HttpException(HttpStatus.CONFLICT, message);
        }

        //TODO: Obtenemos los id's
        const [{ _id: userId }, { _id: countryId }] = await Promise.all([
            userService.saveClient(customerReq.user),
            countryRepo.findOrSave(customerReq.country),
        ]);

        const customerNew: CustomerDB = {
            name: customerReq.name,
            email: customerReq.email,
            photoUrl: customerReq.photoUrl,
            gender: customerReq.gender,
            dateOfBirth: customerReq.dateOfBirth,
            user: userId,
            country: countryId,
        };

        const customerDB = await customerRepo.save(customerNew);
        return adapterCustomerRes(customerDB);
    },

    deleteById: async (id: string) => {
        try {
            await customerRepo.deleteById(id);
        } catch (e) {
            const message = "El cliente no existe!";
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }
    },
    existsEmail,

    update: async (
        id: string,
        customerReq: CustomerUpdate
    ): Promise<CustomerRes> => {
        let customerDB = null;
        try {
            customerDB = await customerRepo.findById(id);
            if (!customerDB) throw new Error();
        } catch (e) {
            const message = "El cliente no existe!";
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }

        const updateFilterMap = new Map();
        //TODO: Verificamos Email
        if (customerReq.email !== customerDB.email) {
            const exists = await existsEmail(customerReq.email);
            if (exists) {
                const message = "El nuevo email ya existe!";
                throw HttpException(HttpStatus.CONFLICT, message);
            }
            updateFilterMap.set("email", customerReq.email);
        }
        //TODO: Cambiamos de Username
        const usernamePrev = customerDB.user.username;
        const usernameNext = customerReq.username;
        if (usernameNext !== usernamePrev) {
            const exists = await userService.existsUsername(usernameNext);
            if (exists) {
                const message = "El nuevo username ya existe!";
                throw HttpException(HttpStatus.CONFLICT, message);
            }
            await userService.updateUsername(usernamePrev, usernameNext);
        }
        //TODO: Cambiamos de País
        if (customerReq.country !== customerDB.country.name) {
            const { _id } = await countryRepo.findOrSave(customerReq.country);
            updateFilterMap.set("country", _id);
        }
        if (customerReq.name !== customerDB.name) {
            updateFilterMap.set("name", customerReq.name);
        }
        if (customerReq.photoUrl !== customerDB.photoUrl) {
            updateFilterMap.set("photoUrl", customerReq.photoUrl);
        }
        if (customerReq.gender !== customerDB.gender) {
            updateFilterMap.set("gender", customerReq.gender);
        }
        if (customerReq.dateOfBirth !== customerDB.dateOfBirth) {
            updateFilterMap.set("dateOfBirth", customerReq.dateOfBirth);
        }
        //TODO: Todo comprobado :D
        const updateFilter = Object.fromEntries(updateFilterMap);
        await customerRepo.update(id, updateFilter);
        return adapterCustomerRes(await customerRepo.findById(id));
    },
};
