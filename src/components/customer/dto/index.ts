import { Types } from "mongoose";
import { UserReq } from "../../user/dto";
import { Gender } from "../customer.service";

export interface CustomerDB {
    name: string;
    email: string;
    photoUrl: string;
    gender: Gender | string;
    dateOfBirth: Date;
    user: Types.ObjectId;
    country: Types.ObjectId;
}

export interface CustomerReq extends Omit<CustomerDB, "user" | "country"> {
    user: UserReq;
    country: string;
}

export interface CustomerRes
    extends Omit<CustomerDB, "user" | "country" | "dateOfBirth"> {
    id: string;
    dateOfBirth: string;
    username: string;
    country: string;
}

export interface CustomerUpdate extends Omit<CustomerDB, "user" | "country"> {
    username: string;
    country: string;
}
