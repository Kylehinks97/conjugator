const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

// create a todo
app.get("/new-lesson", async (req, res) => {
  try {
    const randomizedData = await pool.query(`
            WITH RandomizedRows AS (
                SELECT
                    id,
                    verb_id,
                    subject_pronoun,
                    conjugated_form,
                    kata,
                    ROW_NUMBER() OVER (PARTITION BY verb_id ORDER BY random()) AS rn
                FROM conjugations
            )
            SELECT
                id,
                verb_id,
                subject_pronoun,
                conjugated_form,
                kata
            FROM RandomizedRows
            WHERE rn = 1;
        `);
    res.json(randomizedData.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get all todos

// get a todo

// update a todo

// delete a todo

app.listen(5000, () => {
  console.log("server listening on port 5000 :)");
});
