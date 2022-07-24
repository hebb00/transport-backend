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
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var database = require("./database");
router.post('/vehicle', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = req.body.model;
        const plateNum = req.body.plateNum;
        const info = `INSERT INTO vehicles(model, plate_num)
                VALUES('${model}', '${plateNum}')`;
        try {
            yield database.query(info);
            return res.status(200).json({ "done": "somethingvehicle" });
        }
        catch (err) {
            console.log("DATABASE EERROR", err);
        }
    });
});
router.get("/vehicle", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM vehicles`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows);
                console.log(rows, "vehicles ");
            }
            else {
                return res.status(400).json({ "error": "something" });
            }
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
router.get("/vehicle/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log("id", id);
        const query = ` DELETE FROM vehicles WHERE id = ${id}`;
        try {
            yield database.query(query);
            return res.status(200).json({ "done": "something vehicle" });
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
router.post("/modify-vehicle/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const model = req.body.model;
        const plateNum = req.body.plateNum;
        console.log("id", id);
        const query = `UPDATE vehicles SET model = '${model}', plate_num = '${plateNum}'
             WHERE id = ${id}`;
        try {
            yield database.query(query);
            return res.status(200).json({ "done": "something modify vehicle" });
        }
        catch (err) {
            console.log("DATABASE ERROR", err);
        }
    });
});
router.get("/modify-vehicle/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const query = `SELECT * FROM vehicles WHERE id = ${id}`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows, "vehicle ");
            }
            else {
                return res.status(400).json({ "error": "something" });
            }
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
router.get("/statistic", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT count(id) AS num_vehicles FROM vehicles`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows[0], "vehicles ");
            }
            else {
                return res.status(400).json({ "error": "something" });
            }
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
module.exports = router;
