"use strict";
const { Pool } = require('pg');
// const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL = 'postgres://postgres:poop@localhost:/mydb';
const pool = new Pool({
    connectionString: DATABASE_URL
});
// a generic query, that executes all queries you send to it
function query(text, values = []) {
    return new Promise((resolve, reject) => {
        pool.query(text, values)
            .then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
}
module.exports = {
    query
};
