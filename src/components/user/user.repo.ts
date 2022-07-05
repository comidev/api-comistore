import { UserSave } from "./dto";
import userModel from "./model/mongodb";

const findAll = async () => {
    return await userModel.find({});
};

const save = async (user: UserSave) => {
    const userDB = await userModel.create(user);
    return userDB;
};

const findByUsername = async (username: string) => {
    const userDB = await userModel.findOne({ username });
    return userDB;
};

const findById = async (id: string) => {
    const userDB = await userModel.findById(id);
    return userDB;
};

const update = async (id: string, update: any) => {
    await userModel.findByIdAndUpdate(id, update);
};

export default { findAll, save, findByUsername, findById, update };
