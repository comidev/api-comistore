import { Types } from "mongoose";

export interface UserGet {
    username: string;
}

export interface UserReq {
    username: string;
    password: string;
}

export interface UserSave extends UserReq {
    roles: Types.ObjectId[];
}

export interface UpdatePassword {
    currentPassword: string;
    newPassword: string;
}
