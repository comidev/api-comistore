"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("./model/mongodb"));
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield mongodb_1.default.find({});
});
const save = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userDB = yield mongodb_1.default.create(user);
    return userDB;
});
const findByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const userDB = yield mongodb_1.default
        .findOne({ username })
        .populate("roles");
    return userDB;
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userDB = yield mongodb_1.default.findById(id);
    return userDB;
});
const update = (id, updateFilter) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongodb_1.default.findByIdAndUpdate(id, updateFilter);
});
const updateByUsername = (username, updateFilter) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongodb_1.default.findOneAndUpdate({ username }, updateFilter);
});
exports.default = { findAll, save, findByUsername, findById, update, updateByUsername };
