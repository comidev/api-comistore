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
exports.createInvoice = exports.createInvoiceItem = exports.createCustomer = exports.createCountry = exports.createProduct = exports.createCategory = exports.createTokensByRoles = exports.createUser = exports.createRole = void 0;
const short_uuid_1 = require("short-uuid");
const mongoose_1 = require("mongoose");
const password_1 = require("../utils/password");
const role_repo_1 = require("../components/role/role.repo");
const jwt_1 = require("../utils/jwt");
const mongodb_1 = __importDefault(require("../components/role/model/mongodb"));
const mongodb_2 = __importDefault(require("../components/user/model/mongodb"));
const mongodb_3 = __importDefault(require("../components/category/model/mongodb"));
const mongodb_4 = __importDefault(require("../components/product/model/mongodb"));
const mongodb_5 = __importDefault(require("../components/country/model/mongodb"));
const customer_service_1 = require("../components/customer/customer.service");
const mongodb_6 = __importDefault(require("../components/customer/model/mongodb"));
const mongodb_7 = __importDefault(require("../components/invoice-item/model/mongodb"));
const mongodb_8 = __importDefault(require("../components/invoice/model/mongodb"));
const Id = () => new mongoose_1.Types.ObjectId();
const createRole = (roleName = role_repo_1.RoleName.CLIENTE) => __awaiter(void 0, void 0, void 0, function* () {
    const role = { name: roleName };
    return (yield mongodb_1.default.findOne(role)) || (yield mongodb_1.default.create(role));
});
exports.createRole = createRole;
const createUser = ({ rolesId = [Id()] } = { rolesId: [Id()] }) => __awaiter(void 0, void 0, void 0, function* () {
    const password = "123";
    const passwordHash = yield (0, password_1.encrypt)(password);
    const user = {
        username: (0, short_uuid_1.generate)(),
        password: passwordHash,
        roles: rolesId,
    };
    const { _id, username } = yield mongodb_2.default.create(user);
    return { _id, username, password };
});
exports.createUser = createUser;
const createUserByRoles = (...rolesName) => __awaiter(void 0, void 0, void 0, function* () {
    const rolesPromises = rolesName.map(exports.createRole);
    const roles = yield Promise.all(rolesPromises);
    const rolesId = roles.map((item) => item._id);
    const { _id: userId, username } = yield (0, exports.createUser)({ rolesId });
    return { userId, username };
});
const createTokensByRoles = (...rolesName) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, username } = yield createUserByRoles(...rolesName);
    const roles = rolesName.map((item) => item.toString());
    const tokens = (0, jwt_1.createTokens)({
        id: userId.toJSON(),
        username,
        roles,
    });
    const token = { Authorization: `Bearer ${tokens.access_token}` };
    return { userId, username, token };
});
exports.createTokensByRoles = createTokensByRoles;
const createCategory = (categoryName = "Tecnología") => __awaiter(void 0, void 0, void 0, function* () {
    const category = { name: categoryName };
    return ((yield mongodb_3.default.findOne(category)) ||
        (yield mongodb_3.default.create(category)));
});
exports.createCategory = createCategory;
const createProduct = ({ categoryId = Id() } = { categoryId: Id() }) => __awaiter(void 0, void 0, void 0, function* () {
    const product = {
        name: "Nombre :D",
        description: "Descripcion larga",
        photoUrl: "imagen de la foto",
        stock: 100,
        price: 187.49,
        categories: [categoryId],
    };
    return yield mongodb_4.default.create(product);
});
exports.createProduct = createProduct;
const createCountry = (countryName = "Perú") => __awaiter(void 0, void 0, void 0, function* () {
    const country = { name: countryName };
    return ((yield mongodb_5.default.findOne(country)) || (yield mongodb_5.default.create(country)));
});
exports.createCountry = createCountry;
const createCustomer = ({ userId = Id(), countryId = Id() } = { userId: Id(), countryId: Id() }) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = {
        name: "Omar Miranda",
        email: (0, short_uuid_1.generate)(),
        photoUrl: "foto de perfil",
        gender: customer_service_1.Gender.MALE,
        dateOfBirth: new Date(2000, 3, 11),
        user: userId,
        country: countryId,
    };
    return yield mongodb_6.default.create(customer);
});
exports.createCustomer = createCustomer;
const createInvoiceItem = ({ productId = Id() } = { productId: Id() }) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceItem = { quantity: 3, product: productId };
    return yield mongodb_7.default.create(invoiceItem);
});
exports.createInvoiceItem = createInvoiceItem;
const createInvoice = ({ customerId = Id(), invoiceItemId = Id() } = {
    customerId: Id(),
    invoiceItemId: Id(),
}) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = {
        description: "Descripcion",
        total: 100,
        customer: customerId,
        invoiceItems: [invoiceItemId],
    };
    return yield mongodb_8.default.create(invoice);
});
exports.createInvoice = createInvoice;
