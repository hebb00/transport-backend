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
const bcrypt = require("bcrypt");
var router = express_1.default.Router();
var database = require("./database");
router.post('/register', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const userName = req.body.userName;
        const phoneNum = req.body.phoneNumber; //req.body.phoneNum; smh 
        const role = req.body.role;
        const password = req.body.password;
        const hashedPass = bcrypt.hashSync(password, 10);
        var q = `INSERT INTO users (firstname, lastname, username, password, phone_num, role)
    VALUES ('${firstName}', '${lastName}', '${userName}', '${hashedPass}', '${phoneNum}','${role}');`;
        try {
            yield database.query(q);
            let result = yield logIn(req.body);
            if (result) {
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
        var q = `SELECT id, firstname, lastname, username, password,
     phone_num, role FROM users WHERE username = $1`;
        try {
            var { rows, rowCount } = yield database.query(q, [userName]);
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
        if (pass == '') {
            let que = `SELECT password FROM users WHERE id =${id}`;
            try {
                var { rows } = yield database.query(que);
                var password = rows[0].password;
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            password = bcrypt.hashSync(pass, 10);
        }
        const query = `UPDATE users SET firstname = '${firstName}',  lastname ='${lastName}',
       username ='${userName}', password ='${password}', phone_num = '${phoneNum}' WHERE id =${id};`;
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
        try {
            var { rows } = yield database.query(query);
            res.send(rows[0]);
        }
        catch (error) {
            console.log(error);
        }
    });
});
router.get('/user', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = `SELECT id, firstname, lastname, role, username, phone_num FROM users`;
        try {
            var { rows } = yield database.query(query);
            res.send(rows);
        }
        catch (error) {
            console.log(error);
        }
    });
});
router.get("/user/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log("id", id);
        const query = ` DELETE FROM users WHERE id = ${id}`;
        try {
            yield database.query(query);
            return res.status(200).json({ "done": "something user delete" });
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
router.post("/modify-user/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log(id, "user modify id  ");
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phoneNumber = req.body.phoneNumber;
        const username = req.body.userName;
        const role = req.body.role;
        console.log(req.body, "req body ");
        const qq = `UPDATE users SET firstname = '${firstName}', lastname = '${lastName}',
           phone_num = '${phoneNumber}', role = '${role}',username = '${username}'
            WHERE id = ${id}`;
        try {
            yield database.query(qq);
            return res.status(200).json({ "done": "something modify user" });
        }
        catch (err) {
            console.log("DATABASE ERROR", err);
        }
    });
});
router.get("/statistic", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT count(*) AS num FROM users`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows[0], "users ");
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
