import dotenv from "dotenv";
import mongoose from "mongoose";
import request from "supertest";
import app, { server } from "../app";
import { HttpStatus } from "../midlewares/handleHttpException";
import { createCategory } from "./app-fabric";
import categoryRepo from "../components/category/model/mongodb";

dotenv.config();
const API = request(app);

beforeEach(async () => {
    await categoryRepo.deleteMany({});
});

describe("GET, /categories", () => {
    test("NO CONTENT, cuando no hay ninguna categoría", async () => {
        const response = await API.get("/categories").send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos una categoría", async () => {
        await createCategory();

        const response = await API.get("/categories").send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

afterAll(() => {
    mongoose.disconnect();
    server.close();
});
