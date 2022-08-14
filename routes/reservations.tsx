import express from "express";
var router = express.Router();
var database = require("./database")
import dayjs from 'dayjs'


router.post('/reservation/:id', async function (req, res, next) {
    const RecurrenceRule = req.body.RecurrenceRule;
    const id = req.params.id;
    const description: string = req.body.Description;
    const subject: string = req.body.Subject;
    const startTime = req.body.StartTime;
    const endTime = req.body.EndTime;
    const source = req.body.source;
    const client_id = req.body.client_id;
    const destination = req.body.Location;
    const price = req.body.price;
    const driver_id = req.body.driver_id;
    const vehicle_id = req.body.vehicle_id;
    const isFullDay = req.body.IsAllDay;
    console.log(description, subject, startTime, endTime, "reservation")
    console.log(source, client_id, destination, price, driver_id, vehicle_id, isFullDay)


    const info = `INSERT INTO reservations(description, subject, start_time, end_time, source, destination,
                 price, client_id, user_id, driver_id, vehicle_id, isallday, rule)
                VALUES('${description}', '${subject}', '${startTime}', '${endTime}', '${source}', '${destination}',
                ${price}, ${client_id}, ${id}, ${driver_id}, ${vehicle_id}, ${isFullDay},'${RecurrenceRule}' )`;
    try {
        await database.query(info);
        return res.status(200).json({ "done": "something reservation" });
    } catch (err) {
        console.log("DATABASE EERROR", err)
    }
});

router.get("/reservation", async function (req, res, next) {
    const query = `SELECT id AS "Id", subject AS "Subject", description AS "Description", start_time AS "StartTime",
         end_time AS "EndTime", source, destination AS "Location", driver_id, vehicle_id, price, isallday AS "IsAllDay", rule AS "RecurrenceRule" FROM reservations`;
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

router.post("/modify-reservation/:bookingId/:userId", async function (req, res, next) {
    const user_id = req.params.userId;
    const id = req.params.bookingId;
    console.log("updated event id", id);
    const description: string = req.body.Description;
    const subject: string = req.body.Subject;
    const startTime = req.body.StartTime;
    const endTime = req.body.EndTime;
    const source = req.body.source;
    const client_id = req.body.client_id;
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
    const query = `SELECT concat(clients.firstname, ' ',clients.lastname) AS clientname,
     count(*) AS num_books FROM clients JOIN reservations ON
     clients.id = reservations.client_id GROUP BY clients.id ORDER BY num_books DESC LIMIT 5`;
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

    const query = `SELECT count(*) AS num FROM reservations`;
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

router.get("/graph", async function (req, res, next) {

    const query = `SELECT DISTINCT
                start_time::date AS day, 
                sum(cast(extract (epoch  from (end_time - start_time))/3600 as int)) as hours
                from reservations
                GROUP by day ORDER BY day LIMIT 7;`;
    try {
        var { rows } = await database.query(query);
        if (rows) {
            res.json(rows)
            console.log(rows, "graph stuff ");
        } else {
            return res.status(400).json({ "error": "something" });
        }

    } catch (error) {
        console.log("DATABASE EERROR", error)
    }
});

router.get("/reservation/table", async function (req, res, next) {
    const query = ` SELECT reservations.id AS "Id", reservations.subject AS "Subject",  reservations.description AS "Description",  reservations.start_time AS"StartTime",
         reservations.end_time AS "EndTime",  reservations.source,  reservations.destination AS "Location",  reservations.price,  reservations.isallday AS "IsAllDay",
         concat(clients.firstname,' ', clients.lastname) AS clientname, vehicles.plate_num,concat(drivers.firstname,' ',drivers.lastname)AS drivername  FROM reservations LEFT JOIN
         clients ON  reservations.client_id = clients.id LEFT JOIN vehicles ON reservations.vehicle_id = vehicles.id LEFT JOIN drivers ON
          reservations.driver_id = drivers.id;`;
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

router.get("/reservation/table/:id", async function (req, res, next) {
    const id = req.params.id;
    const query = ` SELECT reservations.id AS "Id", reservations.subject AS "Subject",  reservations.description AS "Description",  reservations.start_time AS"StartTime",
         reservations.end_time AS "EndTime",  reservations.source,  reservations.destination AS "Location",  reservations.price,  reservations.isallday AS "IsAllDay",
         concat(clients.firstname,' ', clients.lastname) AS clientname, vehicles.plate_num,concat(drivers.firstname,' ',drivers.lastname)AS drivername  FROM reservations LEFT JOIN
         clients ON  reservations.client_id = clients.id LEFT JOIN vehicles ON reservations.vehicle_id = vehicles.id LEFT JOIN drivers ON
         reservations.driver_id = drivers.id WHERE reservations.id = ${id}`;
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





module.exports = router;