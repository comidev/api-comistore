import express from "express";
import cors from "cors";
import { config } from "dotenv";
import routers from "./routers/index";
import { handle404 } from "./midlewares/handle404";
import { handleHttpException } from "./midlewares/handleHttpException";
import { dbConnectMongoDB } from "./config/mongodb";

//TODO: Carga el .ENV
config();
const app = express();
const PORT = process.env.PORT || 3000;

//TODO: Acepta peticiones de dónde sea
app.use(cors());
//TODO: Habilita el body
app.use(express.json());
//TODO: Inplementamos las rutas
app.use("", routers);

app.use(handleHttpException);
app.use(handle404);

dbConnectMongoDB();
export const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});

export default app;
