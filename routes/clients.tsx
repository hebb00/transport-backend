import express, { Application, Request, Response } from "express";
var router = express.Router();
var database = require("./database")

router.post('/client', async function (req, res, next) {
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const phoneNumber: string = req.body.phoneNumber;

    const info = `INSERT INTO clients(firstname, lastname, phone_num)
                VALUES('${firstName}', '${lastName}', '${phoneNumber}')`;
    try {
        await database.query(info);
        return res.status(200).json({ "done": "somethingclients" });
    } catch (err) {
        console.log("DATABASE EERROR", err)
    }
});

router.get("/client", async function (req, res, next) {
    const query = `SELECT * FROM clients`;
    try {
        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows)
            console.log(rows, "clients ");
        } else {
            return res.status(400).json({ "error": "something" });
        }
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }
});

router.get("/client/:id", async function (req, res, next) {
    const id = req.params.id;
    console.log("id", id);
    const query = ` DELETE FROM clients WHERE id = ${id}`;
    try {
        await database.query(query);
        return res.status(200).json({ "done": "somethingclients" });
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});

router.post("/modify-client/:id", async function (req, res, next) {
    const id = req.params.id;
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const phoneNumber: string = req.body.phoneNumber;
    console.log("id", id);
    const query = `UPDATE clients SET firstname = '${firstName}', lastname = '${lastName}',phone_num = '${phoneNumber}'
             WHERE id = ${id}`;
    try {
        await database.query(query);
        return res.status(200).json({ "done": "something modify client" });
    } catch (err) {
        console.log("DATABASE ERROR", err)
    }

});



router.get("/modify-client/:id", async function (req, res, next) {
    const id = req.params.id;
    const query = `SELECT * FROM clients WHERE id = ${id}`;
    try {
        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows[0])
            console.log(rows, "client ");

        } else {
            return res.status(400).json({ "error": "something" });

        }
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});

router.get("/statistic", async function (req, res, next) {

    const query = `SELECT count(id) AS num_clients FROM clients`;
    try {

        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows[0])
            console.log(rows[0], "clients ");
        } else {
            return res.status(400).json({ "error": "something" });
        }

    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});



module.exports = router;