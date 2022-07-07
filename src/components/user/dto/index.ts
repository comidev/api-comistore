import { Types } from "mongoose";

export interface UserDB {
    username: string;
    password: string;
    roles: [Types.ObjectId];
}

export type UserRes = Pick<UserDB, "username">;
export type UserReq = Omit<UserDB, "roles">;

export interface UpdatePassword {
    currentPassword: string;
    newPassword: string;
}
