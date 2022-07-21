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
const dayjs_1 = __importDefault(require("dayjs"));
const bcrypt = require("bcrypt");
var router = express_1.default.Router();
var database = require("./database");
router.post('/register', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const userName = req.body.userName;
        const phoneNum = req.body.phoneNumber; //req.body.phoneNum; smh 
        const password = req.body.password;
        const hashedPass = bcrypt.hashSync(password, 10);
        const created_on = (0, dayjs_1.default)().format();
        console.log(req.body, hashedPass, created_on);
        var q = `INSERT INTO users (firstname, lastname, username, password, created_on, phone_num)
    VALUES ('${firstName}', '${lastName}', '${userName}', '${hashedPass}', '${created_on}', '${phoneNum}');`;
        try {
            yield database.query(q);
            let result = yield logIn(req.body);
            if (result) {
                console.log(result);
                return res.json(result);
            }
            else {
                return res.status(400).json({ "error": "something" });
            }
        }
        catch (err) {
            console.log("DATABASE EERROR", err);
        }
    });
});
function logIn(body) {
    return __awaiter(this, void 0, void 0, function* () {
        var userName = body.userName;
        var q = `SELECT id, firstname, lastname, username, password, phone_num FROM users WHERE username = '${userName}'`;
        rows = [];
        try {
            var { rows, rowCount } = yield database.query(q);
            if (rowCount == 0) {
                return null;
            }
            var verified = bcrypt.compareSync(body.password, rows[0]["password"]);
        }
        catch (error) {
            console.log(error);
        }
        if (verified) {
            return rows[0];
        }
        else {
            return null;
        }
    });
}
router.post('/modify/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const userName = req.body.userName;
        const phoneNum = req.body.phoneNumber;
        const pass = req.body.password;
        const hashedPass = bcrypt.hashSync(pass, 10);
        const query = `UPDATE users SET firstname = '${firstName}',  lastname ='${lastName}',
       username ='${userName}', password ='${hashedPass}', phone_num = '${phoneNum}' WHERE id =${id};`;
        try {
            yield database.query(query);
            try {
                const info = `SELECT * FROM users WHERE id = ${id}`;
                const { rows } = yield database.query(info);
                if (rows[0]) {
                    console.log("modify user", rows[0]);
                    return res.json(rows[0]);
                }
                else {
                    return res.status(400).json({ "error": "something" });
                }
            }
            catch (err) {
                console.log("DATABASE EERROR", err);
            }
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
router.post('/login', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let value = yield logIn(req.body);
            if (value) {
                console.log("it works", value);
                return res.json(value);
            }
            else {
                return res.status(400).json({ "error": "something" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
});
router.get('/profile/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var id = req.params.id;
        let query = `SELECT * FROM users WHERE id =${id}`;
        console.log("it works");
        try {
            var { rows } = yield database.query(query);
            res.send(rows);
        }
        catch (error) {
            console.log(error);
        }
    });
});
module.exports = router;
