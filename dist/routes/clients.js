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
router.post('/client', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phoneNumber = req.body.phoneNumber;
        const info = `INSERT INTO clients(firstname, lastname, phone_num)
                VALUES('${firstName}', '${lastName}', '${phoneNumber}')`;
        try {
            yield database.query(info);
            return res.status(200).json({ "done": "somethingclients" });
        }
        catch (err) {
            console.log("DATABASE EERROR", err);
        }
    });
});
router.get("/client", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM clients`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows);
                console.log(rows, "clients ");
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
router.get("/client/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log("id", id);
        const query = ` DELETE FROM clients WHERE id = ${id}`;
        try {
            yield database.query(query);
            return res.status(200).json({ "done": "somethingclients" });
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
router.post("/modify-client/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phoneNumber = req.body.phoneNumber;
        console.log("id", id);
        const query = `UPDATE clients SET firstname = '${firstName}', lastname = '${lastName}',phone_num = '${phoneNumber}'
             WHERE id = ${id}`;
        try {
            yield database.query(query);
            return res.status(200).json({ "done": "something modify client" });
        }
        catch (err) {
            console.log("DATABASE ERROR", err);
        }
    });
});
router.get("/modify-client/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const query = `SELECT * FROM clients WHERE id = ${id}`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows, "client ");
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
        const query = `SELECT count(id) AS num_clients FROM clients`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows[0], "clients ");
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
