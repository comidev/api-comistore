"use strict";
const mongoose = require("mongoose");
const dbConnectMongoDB = () => {
    const { DB_URI, DB_URI_TEST, NODE_ENV } = process.env;
    const dbURI = NODE_ENV === "test" ? DB_URI_TEST : DB_URI;
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
        if (!err) {
            console.log("Conexión correcta :D");
            console.log({ res });
        }
        else {
            console.log("Conexión inccorrect :(");
        }
    });
};
module.exports = { dbConnectMongoDB };