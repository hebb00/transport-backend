import express from "express";
var router = express.Router();
var database = require("./database")
import dayjs from 'dayjs'


router.post("/driver", async function (req, res, next) {
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const phoneNum: string = req.body.phoneNumber; //req.body.phoneNum; smh 
    const licenseNum: number = req.body.licenseNum;
    const licenseType: string = req.body.licenseType
    const licenseExpDate: string = req.body.licenseExpDate
    console.log(firstName, lastName, phoneNum, licenseNum)
    var q: string = `INSERT INTO drivers (firstname, lastname, phone_num, license_num, license_type, license_exp_date)
            VALUES ('${firstName}', '${lastName}', '${phoneNum}', ${licenseNum},'${licenseType}','${licenseExpDate}')`;

    try {
        await database.query(q);
        return res.status(200).json({ "done": "somethingdriver" });

    } catch (err) {
        console.log("DATABASE EERROR", err)
    }
});

router.get("/driver", async function (req, res, next) {

    let query = `SELECT * FROM drivers`;
    try {
        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows)
            console.log(rows, "drivers ");

        } else {
            return res.status(400).json({ "error": "something" });

        }
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});
router.get("/modify-driver/:id", async function (req, res, next) {
    const id = req.params.id;
    const query = `SELECT * FROM drivers WHERE id = ${id}`;
    try {
        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows[0])
            console.log(rows, "driver ");

        } else {
            return res.status(400).json({ "error": "something" });

        }
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});


router.post("/modify-driver/:id", async function (req, res, next) {
    const id = req.params.id;
    console.log(id, "driver modify id  ");
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const phoneNumber: string = req.body.phoneNumber;
    const licenseNum: number = req.body.licenseNum;
    const licenseType: string = req.body.licenseType;
    const licenseExpDate: string = req.body.licenseExpDate;
    console.log(req.body, "req body ");

    const qq = `UPDATE drivers SET firstname = '${firstName}', lastname = '${lastName}', phone_num = '${phoneNumber}',
             license_num = ${licenseNum}, license_type = '${licenseType}', license_exp_date = '${licenseExpDate}' WHERE id = ${id}`;
    try {
        await database.query(qq);
        return res.status(200).json({ "done": "something modify driver" });
    } catch (err) {
        console.log("DATABASE ERROR", err)
    }
});

router.get("/driver/:id", async function (req, res, next) {
    const id = req.params.id;
    console.log("id", id);
    const query = ` DELETE FROM drivers WHERE id = ${id}`;
    try {
        await database.query(query);
        return res.status(200).json({ "done": "something driver delete" });
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }
});

router.get("/statistic", async function (req, res, next) {

    const query = `SELECT count(id) AS num FROM drivers`;
    try {

        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows[0])
            console.log(rows[0], "driver ");
        } else {
            return res.status(400).json({ "error": "something" });
        }

    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});


module.exports = router;