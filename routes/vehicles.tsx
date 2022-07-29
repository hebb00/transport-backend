import express from "express";
var router = express.Router();
var database = require("./database")


router.post('/vehicle', async function (req, res, next) {
    const model: string = req.body.model;
    const plateNum: string = req.body.plateNum;

    const info = `INSERT INTO vehicles(model, plate_num)
                VALUES('${model}', '${plateNum}')`;
    try {
        await database.query(info);
        return res.status(200).json({ "done": "somethingvehicle" });
    } catch (err) {
        console.log("DATABASE EERROR", err)
    }
});

router.get("/vehicle", async function (req, res, next) {
    const query = `SELECT * FROM vehicles`;
    try {
        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows)
            console.log(rows, "vehicles ");
        } else {
            return res.status(400).json({ "error": "something" });
        }
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }
});
router.get("/vehicle/:id", async function (req, res, next) {
    const id = req.params.id;
    console.log("id", id);
    const query = ` DELETE FROM vehicles WHERE id = ${id}`;
    try {
        await database.query(query);
        return res.status(200).json({ "done": "something vehicle" });
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});

router.post("/modify-vehicle/:id", async function (req, res, next) {
    const id = req.params.id;
    const model: string = req.body.model;
    const plateNum: string = req.body.plateNum;
    console.log("id", id);
    const query = `UPDATE vehicles SET model = '${model}', plate_num = '${plateNum}'
             WHERE id = ${id}`;
    try {
        await database.query(query);
        return res.status(200).json({ "done": "something modify vehicle" });
    } catch (err) {
        console.log("DATABASE ERROR", err)
    }

});



router.get("/modify-vehicle/:id", async function (req, res, next) {
    const id = req.params.id;
    const query = `SELECT * FROM vehicles WHERE id = ${id}`;
    try {
        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows[0])
            console.log(rows, "vehicle ");

        } else {
            return res.status(400).json({ "error": "something" });

        }
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});

router.get("/statistic", async function (req, res, next) {

    const query = `SELECT count(id) AS num FROM vehicles`;
    try {

        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows[0])
            console.log(rows[0], "vehicles ");
        } else {
            return res.status(400).json({ "error": "something" });
        }

    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});







module.exports = router;