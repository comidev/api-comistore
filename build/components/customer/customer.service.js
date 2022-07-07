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
exports.Gender = void 0;
const handleHttpException_1 = require("../../midlewares/handleHttpException");
const customer_repo_1 = __importDefault(require("./customer.repo"));
const country_repo_1 = __importDefault(require("../country/country.repo"));
const user_service_1 = __importDefault(require("../user/user.service"));
var Gender;
(function (Gender) {
    Gender["MALE"] = "Masculino";
    Gender["FEMALE"] = "Femenino";
    Gender["OTHER"] = "Otro";
})(Gender = exports.Gender || (exports.Gender = {}));
const adapterCustomerRes = (item) => {
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
const existsEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const customerDB = yield customer_repo_1.default.findByEmail(email);
    return Boolean(customerDB);
});
exports.default = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        const customersDB = yield customer_repo_1.default.findAll();
        return customersDB.map(adapterCustomerRes);
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customerDB = yield customer_repo_1.default.findById(id);
            if (!customerDB)
                throw new Error();
            return adapterCustomerRes(customerDB);
        }
        catch (e) {
            const message = "El cliente no existe!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
    }),
    save: (customerReq) => __awaiter(void 0, void 0, void 0, function* () {
        const exists = yield existsEmail(customerReq.email);
        if (exists) {
            const message = "El email ya existe!!!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.CONFLICT, message);
        }
        //TODO: Obtenemos los id's
        const [{ _id: userId }, { _id: countryId }] = yield Promise.all([
            user_service_1.default.saveClient(customerReq.user),
            country_repo_1.default.findOrSave(customerReq.country),
        ]);
        const customerNew = {
            name: customerReq.name,
            email: customerReq.email,
            photoUrl: customerReq.photoUrl,
            gender: customerReq.gender,
            dateOfBirth: customerReq.dateOfBirth,
            user: userId,
            country: countryId,
        };
        const customerDB = yield customer_repo_1.default.save(customerNew);
        return adapterCustomerRes(customerDB);
    }),
    deleteById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield customer_repo_1.default.deleteById(id);
        }
        catch (e) {
            const message = "El cliente no existe!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
    }),
    existsEmail,
    update: (id, customerReq) => __awaiter(void 0, void 0, void 0, function* () {
        let customerDB = null;
        try {
            customerDB = yield customer_repo_1.default.findById(id);
            if (!customerDB)
                throw new Error();
        }
        catch (e) {
            const message = "El cliente no existe!";
            throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.NOT_FOUND, message);
        }
        const updateFilterMap = new Map();
        //TODO: Verificamos Email
        if (customerReq.email !== customerDB.email) {
            const exists = yield existsEmail(customerReq.email);
            if (exists) {
                const message = "El nuevo email ya existe!";
                throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.CONFLICT, message);
            }
            updateFilterMap.set("email", customerReq.email);
        }
        //TODO: Cambiamos de Username
        const usernamePrev = customerDB.user.username;
        const usernameNext = customerReq.username;
        if (usernameNext !== usernamePrev) {
            const exists = yield user_service_1.default.existsUsername(usernameNext);
            if (exists) {
                const message = "El nuevo username ya existe!";
                throw (0, handleHttpException_1.HttpException)(handleHttpException_1.HttpStatus.CONFLICT, message);
            }
            yield user_service_1.default.updateUsername(usernamePrev, usernameNext);
        }
        //TODO: Cambiamos de País
        if (customerReq.country !== customerDB.country.name) {
            const { _id } = yield country_repo_1.default.findOrSave(customerReq.country);
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
        yield customer_repo_1.default.update(id, updateFilter);
        return adapterCustomerRes(yield customer_repo_1.default.findById(id));
    }),
};
