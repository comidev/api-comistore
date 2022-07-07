import { RoleDB } from "../role/dto";
import { UserDB } from "./dto";
import userModel from "./model/mongodb";

const findAll = async () => {
    return await userModel.find({});
};

const save = async (user: UserDB) => {
    const userDB = await userModel.create(user);
    return userDB;
};

const findByUsername = async (username: string) => {
    const userDB = await userModel
        .findOne({ username })
        .populate<{ roles: RoleDB[] }>("roles");
    return userDB;
};

const findById = async (id: string) => {
    const userDB = await userModel.findById(id);
    return userDB;
};

const update = async (id: string, updateFilter: object) => {
    await userModel.findByIdAndUpdate(id, updateFilter);
};

const updateByUsername = async (username: string, updateFilter: object) => {
    await userModel.findOneAndUpdate({ username }, updateFilter);
};

export default { findAll, save, findByUsername, findById, update, updateByUsername };
