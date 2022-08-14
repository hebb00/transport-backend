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
router.post("/driver", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phoneNum = req.body.phoneNumber; //req.body.phoneNum; smh 
        const licenseNum = req.body.licenseNum;
        const licenseType = req.body.licenseType;
        const licenseExpDate = req.body.licenseExpDate;
        console.log(firstName, lastName, phoneNum, licenseNum);
        var q = `INSERT INTO drivers (firstname, lastname, phone_num, license_num, license_type, license_exp_date)
            VALUES ('${firstName}', '${lastName}', '${phoneNum}', ${licenseNum},'${licenseType}','${licenseExpDate}')`;
        try {
            yield database.query(q);
            return res.status(200).json({ "done": "somethingdriver" });
        }
        catch (err) {
            console.log("DATABASE EERROR", err);
        }
    });
});
router.get("/driver", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = `SELECT * FROM drivers`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows);
                console.log(rows, "drivers ");
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
router.get("/modify-driver/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const query = `SELECT * FROM drivers WHERE id = ${id}`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows, "driver ");
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
router.post("/modify-driver/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log(id, "driver modify id  ");
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phoneNumber = req.body.phoneNumber;
        const licenseNum = req.body.licenseNum;
        const licenseType = req.body.licenseType;
        const licenseExpDate = req.body.licenseExpDate;
        console.log(req.body, "req body ");
        const qq = `UPDATE drivers SET firstname = '${firstName}', lastname = '${lastName}', phone_num = '${phoneNumber}',
             license_num = ${licenseNum}, license_type = '${licenseType}', license_exp_date = '${licenseExpDate}' WHERE id = ${id}`;
        try {
            yield database.query(qq);
            return res.status(200).json({ "done": "something modify driver" });
        }
        catch (err) {
            console.log("DATABASE ERROR", err);
        }
    });
});
router.get("/driver/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log("id", id);
        const query = ` DELETE FROM drivers WHERE id = ${id}`;
        try {
            yield database.query(query);
            return res.status(200).json({ "done": "something driver delete" });
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
router.get("/statistic", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT count(*) AS num FROM drivers`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows[0], "driver ");
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
router.get("/pie", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT count(*) AS num FROM 
        drivers WHERE license_type = 'heavy'`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows[0], "driver ");
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
