import { HttpException, HttpStatus } from "../../midlewares/handleHttpException";
import roleRepo, { RoleName } from "../role/role.repo";
import { UpdatePassword, UserRes, UserReq, UserDB } from "./dto";
import { encrypt, compare } from "../../utils/password";
import userRepo from "./user.repo";
import { createTokens, isBearer, verify } from "../../utils/jwt";

const adapterUserRes = (item: any): UserRes => {
    const { username } = item;
    return { username };
};

const save = async (user: UserReq, roleName: RoleName) => {
    const { _id: roleId } = await roleRepo.findOrSave(roleName);
    const password: string = await encrypt(user.password);

    const userNew: UserDB = {
        username: user.username,
        password,
        roles: [roleId],
    };

    try {
        return await userRepo.save(userNew);
    } catch (e) {
        const message = `El username ya existe ${userNew.username}`;
        throw HttpException(HttpStatus.CONFLICT, message);
    }
};

export default {
    findAll: async (): Promise<UserRes[]> => {
        const usersDB = await userRepo.findAll();
        return usersDB.map(adapterUserRes);
    },

    saveAdmin: async (user: UserReq): Promise<UserRes> => {
        const userDB = await save(user, RoleName.ADMIN);
        return adapterUserRes(userDB);
    },

    saveClient: async (user: UserReq) => {
        const userDB = await save(user, RoleName.CLIENTE);
        return userDB;
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

        const roles: string[] = userDB.roles.map((item) => item.name);

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
            throw HttpException(HttpStatus.UNAUTHORIZED, message);
        }

        try {
            verify(token);
            return true;
        } catch (e) {
            return false;
        }
    },

    updateUsername: async (usernamePrev: string, usernameNext: string) => {
        await userRepo.updateByUsername(usernamePrev, { username: usernameNext });
    },
};
