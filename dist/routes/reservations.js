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
router.post('/reservation/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const RecurrenceRule = req.body.RecurrenceRule;
        console.log(RecurrenceRule, "requrrence");
        const id = req.params.id;
        const description = req.body.Description;
        const subject = req.body.Subject;
        const startTime = req.body.StartTime;
        const endTime = req.body.EndTime;
        const source = req.body.source;
        const client_id = req.body.client_id;
        const destination = req.body.Location;
        const price = req.body.price;
        const driver_id = req.body.driver_id;
        const vehicle_id = req.body.vehicle_id;
        const isFullDay = req.body.IsAllDay;
        console.log(description, subject, startTime, endTime, "reservation");
        console.log(source, client_id, destination, price, driver_id, vehicle_id, isFullDay);
        const info = `INSERT INTO reservations(description, subject, start_time, end_time, source, destination,
                 price, client_id, user_id, driver_id, vehicle_id, isallday, rule)
                VALUES('${description}', '${subject}', '${startTime}', '${endTime}', '${source}', '${destination}',
                ${price}, ${client_id}, ${id}, ${driver_id}, ${vehicle_id}, ${isFullDay},'${RecurrenceRule}' )`;
        try {
            yield database.query(info);
            return res.status(200).json({ "done": "something reservation" });
        }
        catch (err) {
            console.log("DATABASE EERROR", err);
        }
    });
});
router.get("/reservation", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT id AS "Id", subject AS "Subject", description AS "Description", start_time AS "StartTime",
         end_time AS "EndTime", source, destination AS "Location", driver_id, vehicle_id, price, isallday AS "IsAllDay", rule AS "RecurrenceRule" FROM reservations`;
        try {
            const { rows } = yield database.query(query);
            if (rows) {
                res.json(rows);
                console.log(rows, "books ");
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
router.get("/delete-reservation/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        console.log("id", id);
        const query = ` DELETE FROM reservations WHERE id = ${id}`;
        try {
            yield database.query(query);
            return res.status(200).json({ "done": "something reservations" });
        }
        catch (error) {
            console.log("DATABASE EERROR", error);
        }
    });
});
router.post("/modify-reservation/:bookingId/:userId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.params.userId;
        const id = req.params.bookingId;
        console.log("updated event id", id);
        const description = req.body.Description;
        const subject = req.body.Subject;
        const startTime = req.body.StartTime;
        const endTime = req.body.EndTime;
        const source = req.body.source;
        const client_id = req.body.client_id;
        const destination = req.body.Location;
        const price = req.body.price;
        const driver_id = req.body.driver_id;
        const vehicle_id = req.body.vehicle_id;
        const isFullDay = req.body.IsAllDay;
        console.log(description, subject, startTime, endTime, user_id, "reservation");
        console.log(source, client_id, destination, price, driver_id, vehicle_id, isFullDay);
        const query = `UPDATE reservations SET description = '${description}', subject = '${subject}', start_time = '${startTime}',
               end_time = '${endTime}', source = '${source}', destination = '${destination}',
               price = ${price}, client_id = ${client_id}, user_id = ${user_id}, driver_id = ${driver_id},
               vehicle_id = ${vehicle_id}, isallday = ${isFullDay} WHERE id = ${id}`;
        try {
            yield database.query(query);
            return res.status(200).json({ "done": "something modify reservation" });
        }
        catch (err) {
            console.log("DATABASE ERROR", err);
        }
    });
});
router.get("/clients-reservation", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("here client reservations");
        const query = `SELECT concat(clients.firstname, ' ',clients.lastname) AS clientname,
     count(*) AS num_books FROM clients JOIN reservations ON
     clients.id = reservations.client_id GROUP BY clients.id ORDER BY num_books DESC`;
        try {
            const { rows } = yield database.query(query);
            if (rows) {
                res.json(rows);
                console.log(rows, "booking done");
            }
        }
        catch (err) {
            console.log("DATABASE ERROR", err);
        }
    });
});
router.get("/statistic", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT count(id) AS num FROM reservations`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows[0]);
                console.log(rows[0], "book ");
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
router.get("/graph", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT DISTINCT
                start_time::date AS day, 
                sum(cast(extract (epoch  from (end_time - start_time))/3600 as int)) as hours
                from reservations
                GROUP by day ORDER BY day LIMIT 7;`;
        try {
            var { rows } = yield database.query(query);
            if (rows) {
                res.json(rows);
                console.log(rows, "graph stuff ");
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
router.get("/reservation/table", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = ` SELECT reservations.id AS "Id", reservations.subject AS "Subject",  reservations.description AS "Description",  reservations.start_time AS"StartTime",
         reservations.end_time AS "EndTime",  reservations.source,  reservations.destination AS "Location",  reservations.price,  reservations.isallday AS "IsAllDay",
         concat(clients.firstname,' ', clients.lastname) AS clientname, vehicles.plate_num,concat(drivers.firstname,' ',drivers.lastname)AS drivername  FROM reservations LEFT JOIN
         clients ON  reservations.client_id = clients.id LEFT JOIN vehicles ON reservations.vehicle_id = vehicles.id LEFT JOIN drivers ON
          reservations.driver_id = drivers.id;`;
        try {
            const { rows } = yield database.query(query);
            if (rows) {
                res.json(rows);
                console.log(rows, "books ");
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
router.get("/reservation/table/:id", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const query = ` SELECT reservations.id AS "Id", reservations.subject AS "Subject",  reservations.description AS "Description",  reservations.start_time AS"StartTime",
         reservations.end_time AS "EndTime",  reservations.source,  reservations.destination AS "Location",  reservations.price,  reservations.isallday AS "IsAllDay",
         concat(clients.firstname,' ', clients.lastname) AS clientname, vehicles.plate_num,concat(drivers.firstname,' ',drivers.lastname)AS drivername  FROM reservations LEFT JOIN
         clients ON  reservations.client_id = clients.id LEFT JOIN vehicles ON reservations.vehicle_id = vehicles.id LEFT JOIN drivers ON
         reservations.driver_id = drivers.id WHERE reservations.id = ${id}`;
        try {
            const { rows } = yield database.query(query);
            if (rows) {
                res.json(rows);
                console.log(rows, "books ");
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
