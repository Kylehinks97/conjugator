# Change this to your PostgreSQL username and database name
USERNAME="kylehinks97"
DATABASE="conjugator"

# Execute the database.sql script in the root directory
psql -U ${USERNAME} -d ${DATABASE} -f database.sql

# Directory containing the .sql files
SQL_DIR="insertions"

# Execute the verbs.sql file before looping through the others
psql -U ${USERNAME} -d ${DATABASE} -f verbs.sql

# Loop through .sql files in the insertions folder and execute them
for FILE in ${SQL_DIR}/*.sql; do
  psql -U ${USERNAME} -d ${DATABASE} -f ${FILE}
done

