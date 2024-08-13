require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql');

// Create connection to MySQL server (without specifying the database initially)
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Connect to MySQL server
con.connect((err) => {
    if (err) {
        console.log("Error connecting to MySQL:", err);
    } else {
        console.log("MySQL connected...!");

        // Create the database if it doesn't exist
        con.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err, result) => {
            if (err) {
                console.log("Error creating database:", err);
                return;
            }
            console.log(`Database '${process.env.DB_NAME}' created or already exists.`);

            // Switch to the created database
            con.changeUser({database: process.env.DB_NAME}, (err) => {
                if (err) {
                    console.log("Error switching to database:", err);
                    return;
                }

                // SQL query to create the `todo` table
                const createTableQuery = `
                    CREATE TABLE IF NOT EXISTS todo (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        todo_title VARCHAR(255) NOT NULL,
                        description TEXT NULL,
                        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        status BOOLEAN DEFAULT true
                    )
                `;

                // Execute the query to create the table
                con.query(createTableQuery, (error, results) => {
                    if (error) {
                        console.log("Error creating `todo` table:", error);
                    } else {
                        console.log("`todo` table created successfully or already exists.");
                    }

                    // Close the connection after the operation
                    con.end();
                });
            });
        });
    }
});

module.exports = con;
