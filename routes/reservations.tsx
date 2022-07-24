import express from "express";
var router = express.Router();
var database = require("./database")


router.post('/reservation/:id', async function (req, res, next) {
    const id = req.params.id;
    console.log(id, "user id")
    const description: string = req.body.Description;
    const subject: string = req.body.Subject;
    const startTime = req.body.StartTime;
    const endTime = req.body.EndTime;
    const source = req.body.source;
    const client_id = req.body.clientName;
    const destination = req.body.Location;
    const price = req.body.price;
    const driver_id = req.body.TaskId;
    const vehicle_id = req.body.ProjectId;
    const isFullDay = req.body.IsAllDay;
    console.log(description, subject, startTime, endTime, "reservation")
    console.log(source, client_id, destination, price, driver_id, vehicle_id, isFullDay)


    const info = `INSERT INTO reservations(description, subject, start_time, end_time, source, destination,
                 price, client_id, user_id, driver_id, vehicle_id, isFullDay)
                VALUES('${description}', '${subject}', '${startTime}', '${endTime}', '${source}', '${destination}',
                ${price}, ${client_id}, ${id}, ${driver_id}, ${vehicle_id}, ${isFullDay} )`;
    try {
        await database.query(info);
        return res.status(200).json({ "done": "something reservation" });
    } catch (err) {
        console.log("DATABASE EERROR", err)
    }
});

router.get("/reservation", async function (req, res, next) {
    const query = `SELECT * FROM reservations`;
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

router.get("/reservation/:id", async function (req, res, next) {
    const id = req.params.id;
    console.log("id", id);
    const query = ` DELETE FROM reservations WHERE id = ${id}`;
    try {
        await database.query(query);
        return res.status(200).json({ "done": "something reservations" });
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});

router.post("/modify-reservation/:id", async function (req, res, next) {
    const id = req.params.id;
    console.log("id", id);
    const query = `UPDATE reservations SET  
             WHERE id = ${id}`;
    try {
        await database.query(query);
        return res.status(200).json({ "done": "something modify reservation" });
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









module.exports = router;