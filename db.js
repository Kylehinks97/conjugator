const Pool = require("pg").Pool

const pool = new Pool ({
    user: "kylehinks97",
    password: "redredred123",
    host: "localhost",
    port: 5432,
    database: "conjugator"
})

module.exports = pool;