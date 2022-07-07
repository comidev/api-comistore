import dotenv from "dotenv";
import app, { server } from "../app";
import request from "supertest";
import countryModel from "../components/country/model/mongodb";
import { HttpStatus } from "../midlewares/handleHttpException";
import mongoose from "mongoose";
import { createCountry } from "./app-fabric";

dotenv.config();
const API = request(app);

beforeEach(async () => await countryModel.deleteMany({}));

describe("GET, /countries", () => {
    test("NO CONTENT, cuando no hay paises", async () => {
        const response = await API.get("/countries").send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando no hay al menos un país", async () => {
        const { name } = await createCountry();

        const response = await API.get("/countries").send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toStrictEqual([{ name }]);
    });
});

afterAll(() => {
    mongoose.disconnect();
    server.close();
});
