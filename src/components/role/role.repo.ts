import repoModel from "./model/mongodb";

export enum RoleName {
    CLIENTE = "CLIENTE",
    ADMIN = "ADMIN",
}
export default {
    save: async (roleName: RoleName) => {
        const role = { name: roleName };
        return (await repoModel.findOne(role)) || (await repoModel.create(role));
    },
    findById: async (id: any) => {
        const role = await repoModel.findById(id);
        return role;
    },
};
