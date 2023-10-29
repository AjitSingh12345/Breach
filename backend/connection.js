const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.USER.DBPORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

module.exports = pool