import bcrypt from "bcrypt";

const SALE_ROUND = 10;

export const encrypt = async (password: string) => {
    const passwordHash = await bcrypt.hash(password, SALE_ROUND);
    return passwordHash;
};

export const compare = async (passPlain: string, passEncrypt: string) => {
    const isEqual = await bcrypt.compare(passPlain, passEncrypt);
    return isEqual;
};
