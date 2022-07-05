import { generate } from "short-uuid";
import { Types } from "mongoose";
import { encrypt } from "../../utils/password";
import { RoleName } from "../../components/role/role.repo";
import roleModel from "../../components/role/model/mongodb";
import userModel from "../../components/user/model/mongodb";
import { createTokens, Tokens } from "../../utils/jwt";

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
