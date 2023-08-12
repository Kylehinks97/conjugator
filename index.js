const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")

//middleware
app.use(cors())
app.use(express.json())

//ROUTES//

// create a todo
app.get("/verbs", async(req, res) => {
    try {
        const allData = await pool.query("SELECT * FROM verbs;")
        res.json(allData.rows)
    } catch (err) {
        console.error(err.message)
    }
})
// get all todos

// get a todo

// update a todo

// delete a todo

app.listen(5000, () => {
    console.log("server listening on port 5000 :)");
})