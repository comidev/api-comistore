import { HttpException, HttpStatus } from "../../midlewares/handleHttpException";
import roleRepo, { RoleName } from "../role/role.repo";
import { UpdatePassword, UserGet, UserReq, UserSave } from "./dto";
import { encrypt, compare } from "../../utils/password";
import userRepo from "./user.repo";
import { createTokens, isBearer, verify } from "../../utils/jwt";

const save = async (user: UserReq, roleName: RoleName): Promise<UserGet> => {
    const { _id: roleId } = await roleRepo.save(roleName);

    const password: string = await encrypt(user.password);

    const userSave: UserSave = {
        username: user.username,
        password,
        roles: [roleId],
    };

    try {
        const userDB = await userRepo.save(userSave);
        const userRes: UserGet = { username: userDB.username };
        return userRes;
    } catch (e) {
        const message = `El username ya existe ${userSave.username}`;
        throw HttpException(HttpStatus.CONFLICT, message);
    }
};

export const saveClient = async (user: UserReq): Promise<UserGet> => {
    return await save(user, RoleName.CLIENTE);
};

export default {
    findAll: async (): Promise<UserGet[]> => {
        const usersDB = await userRepo.findAll();
        const users: UserGet[] = usersDB.map((item) => {
            const username = item.username;
            return { username };
        });
        return users;
    },

    saveAdmin: async (user: UserReq): Promise<UserGet> => {
        return await save(user, RoleName.ADMIN);
    },

    existsUsername: async (username: string): Promise<boolean> => {
        const userDB = await userRepo.findByUsername(username);
        return Boolean(userDB);
    },

    updatePassword: async (userId: string, passwords: UpdatePassword) => {
        let userDB = null;
        try {
            userDB = await userRepo.findById(userId);
            if (!userDB) throw new Error();
        } catch (e) {
            const message = `El usuario no existe!`;
            throw HttpException(HttpStatus.NOT_FOUND, message);
        }

        const areEqual = await compare(passwords.currentPassword, userDB.password);
        if (!areEqual) {
            const message = `Password incorrecto!!!`;
            throw HttpException(HttpStatus.UNAUTHORIZED, message);
        }

        await userRepo.update(userId, { password: passwords.newPassword });
    },

    login: async (user: UserReq) => {
        const userDB = await userRepo.findByUsername(user.username);
        if (!userDB) {
            const message = "Username y/o password incorrecto(s)";
            throw HttpException(HttpStatus.UNAUTHORIZED, message);
        }

        const areEqual = await compare(user.password, userDB.password);
        if (!areEqual) {
            const message = "Username y/o password incorrecto(s)";
            throw HttpException(HttpStatus.UNAUTHORIZED, message);
        }

        const roles: string[] = [];
        for (const roleDB of userDB.roles) {
            const role = await roleRepo.findById(roleDB);
            const roleName = role?.name || "";
            roles.push(roleName);
        }

        //TODO: Inicia sesión
        return createTokens({
            id: userDB._id.toJSON(),
            username: userDB.username,
            roles,
        });
    },

    tokenRefresh: async (tokenRefresh: string) => {
        if (!tokenRefresh) {
            const message = "Debe enviar un token!";
            throw HttpException(HttpStatus.BAD_REQUEST, message);
        }

        if (!isBearer(tokenRefresh)) {
            const message = "Token inválido!";
            throw HttpException(HttpStatus.UNAUTHORIZED, message);
        }

        const payload = verify(tokenRefresh);

        //TODO: Actualizamos sus tokesns :D
        return createTokens(payload);
    },

    tokenValidate: async (token: string) => {
        if (!token) {
            const message = "Debe enviar un token!";
            throw HttpException(HttpStatus.BAD_REQUEST, message);
        }

        try {
            verify(token);
            return true;
        } catch (e) {
            return false;
        }
    },
};
