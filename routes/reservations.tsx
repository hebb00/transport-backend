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
    const client_id = req.body.client;
    const destination = req.body.Location;
    const price = req.body.price;
    const driver_id = req.body.driver_id;
    const vehicle_id = req.body.vehicle_id;
    const isFullDay = req.body.IsAllDay;
    console.log(description, subject, startTime, endTime, "reservation")
    console.log(source, client_id, destination, price, driver_id, vehicle_id, isFullDay)


    const info = `INSERT INTO reservations(description, subject, start_time, end_time, source, destination,
                 price, client_id, user_id, driver_id, vehicle_id, isallday)
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
    const query = `SELECT id AS "Id", subject AS "Subject", description AS "Description", start_time AS"StartTime",
         end_time AS "EndTime", source, destination AS "Location", driver_id, vehicle_id, isallday AS "IsAllDay"  FROM reservations`;
    try {
        const { rows } = await database.query(query);
        if (rows) {
            res.json(rows)
            console.log(rows, "books ");
        } else {
            return res.status(400).json({ "error": "something" });
        }
    } catch (error) {
        console.log("DATABASE EERROR", error)
    }
});

router.get("/delete-reservation/:id", async function (req, res, next) {
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
    const user_id = req.params.id;

    const id = req.body.Id;
    console.log("updated event id", id);
    const description: string = req.body.Description;
    const subject: string = req.body.Subject;
    const startTime = req.body.StartTime;
    const endTime = req.body.EndTime;
    const source = req.body.source;
    const client_id = req.body.client;
    const destination = req.body.Location;
    const price = req.body.price;
    const driver_id = req.body.driver_id;
    const vehicle_id = req.body.vehicle_id;
    const isFullDay = req.body.IsAllDay;
    console.log(description, subject, startTime, endTime, user_id, "reservation")
    console.log(source, client_id, destination, price, driver_id, vehicle_id, isFullDay)

    const query = `UPDATE reservations SET description = '${description}', subject = '${subject}', start_time = '${startTime}',
               end_time = '${endTime}', source = '${source}', destination = '${destination}',
               price = ${price}, client_id = ${client_id}, user_id = ${user_id}, driver_id = ${driver_id},
               vehicle_id = ${vehicle_id}, isallday = ${isFullDay} WHERE id = ${id}`;
    try {
        await database.query(query);
        return res.status(200).json({ "done": "something modify reservation" });
    } catch (err) {
        console.log("DATABASE ERROR", err)
    }

});

router.get("/clients-reservation", async function (req, res, next) {
    console.log("here client reservations")
    const query = `SELECT clients.firstname , clients.lastname ,count(reservations.id) AS num_books
    FROM clients JOIN reservations on clients.id = reservations.client_id 
    GROUP BY clients.id`;
    try {
        const { rows } = await database.query(query);
        if (rows) {
            res.json(rows)
            console.log(rows, "booking done")
        }
    } catch (err) {
        console.log("DATABASE ERROR", err)
    }

});

router.get("/statistic", async function (req, res, next) {

    const query = `SELECT count(id) AS num FROM reservations`;
    try {

        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows[0])
            console.log(rows[0], "book ");
        } else {
            return res.status(400).json({ "error": "something" });
        }

    } catch (error) {
        console.log("DATABASE EERROR", error)
    }

});









module.exports = router;