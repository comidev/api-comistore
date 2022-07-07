import mongoose from "mongoose";

export const dbConnectMongoDB = () => {
    const { DB_URI, DB_URI_TEST, NODE_ENV } = process.env;
    const dbURI = NODE_ENV === "test" ? DB_URI_TEST : DB_URI;

    mongoose.connect(dbURI || "", (err: any) => {
        if (!err) {
            console.log("Conexión correcta :D");
        } else {
            console.log("Conexión inccorrect :(");
        }
    });
};
