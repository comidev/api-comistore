import { generate } from "short-uuid";
import { Types } from "mongoose";
import { encrypt } from "../utils/password";
import { RoleName } from "../components/role/role.repo";
import { createTokens, Tokens } from "../utils/jwt";
import roleModel from "../components/role/model/mongodb";
import userModel from "../components/user/model/mongodb";
import categoryModel from "../components/category/model/mongodb";
import productModel from "../components/product/model/mongodb";
import countryModel from "../components/country/model/mongodb";
import customerModel from "../components/customer/model/mongodb";
import { Gender } from "../components/customer/customer.service";

const Id = () => new Types.ObjectId();

export const createRole = async (roleName: RoleName = RoleName.CLIENTE) => {
    const role = { name: roleName };
    return (await roleModel.findOne(role)) || (await roleModel.create(role));
};

export const createUser = async ({ rolesId = [Id()] } = { rolesId: [Id()] }) => {
    const password = "123";
    const passwordHash = await encrypt(password);
    const user = {
        username: generate(),
        password: passwordHash,
        roles: rolesId,
    };
    const { _id, username } = await userModel.create(user);
    return { _id, username, password };
};

const createUserByRoles = async (...rolesName: RoleName[]) => {
    const rolesPromises = rolesName.map(createRole);
    const roles = await Promise.all(rolesPromises);
    const rolesId = roles.map((item) => item._id);

    const { _id: userId, username } = await createUser({ rolesId });

    return { userId, username };
};

export const createTokensByRoles = async (...rolesName: RoleName[]) => {
    const { userId, username } = await createUserByRoles(...rolesName);
    const roles = rolesName.map((item) => item.toString());
    const tokens: Tokens = createTokens({
        id: userId.toJSON(),
        username,
        roles,
    });
    const token = { Authorization: `Bearer ${tokens.access_token}` };
    return { userId, username, token };
};

export const createCategory = async (categoryName: string = "Tecnología") => {
    const category = { name: categoryName };
    return (
        (await categoryModel.findOne(category)) ||
        (await categoryModel.create(category))
    );
};

export const createProduct = async (
    { categoryId = Id() } = { categoryId: Id() }
) => {
    const product = {
        name: "Nombre :D",
        description: "Descripcion larga",
        photoUrl: "imagen de la foto",
        stock: 100,
        price: 187.49,
        categories: [categoryId],
    };
    return await productModel.create(product);
};

export const createCountry = async (countryName: string = "Perú") => {
    const country = { name: countryName };
    return (
        (await countryModel.findOne(country)) || (await countryModel.create(country))
    );
};

export const createCustomer = async (
    { userId = Id(), countryId = Id() } = { userId: Id(), countryId: Id() }
) => {
    const customer = {
        name: "Omar Miranda",
        email: generate(),
        photoUrl: "foto de perfil",
        gender: Gender.MALE,
        dateOfBirth: new Date(2000, 3, 11),
        user: userId,
        country: countryId,
    };
    return await customerModel.create(customer);
};
