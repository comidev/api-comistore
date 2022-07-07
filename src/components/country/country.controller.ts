import { Router } from "express";
import { Controller, tryOrError } from "../../utils/controller";
import countryService from "./country.service";
import { CountryRes } from "./dto";

const router = Router();

const findAll: Controller = async (_req, res) => {
    const countries: CountryRes[] = await countryService.findAll();
    res.status(countries.length === 0 ? 204 : 200);
    res.send(countries);
};

router.get("", tryOrError(findAll));

export default { router };
