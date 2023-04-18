const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const exphbs  = require('express-handlebars');



// Configure PostgreSQL connection
const pool = new pg.Pool({
    user: 'krhypwqm',
    host: 'suleiman.db.elephantsql.com',
    database: 'krhypwqm',
    password: '0s9wUh-JU1SkxoXswFTv_zGYlicaX2Pp',
    port: 5432
});

// Prepare the database
pool.query(
    `CREATE TABLE IF NOT EXISTS users (
           id SERIAL             PRIMARY KEY,
           name VARCHAR(255)     NOT NULL,
           email VARCHAR(255)    NOT NULL UNIQUE,
           created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
        );`
    );

// Load styles from public folder
app.use(express.static("./public/"));

// Define a custom Handlebars helper function to format dates
const hbs = exphbs.create({
    helpers: {
        formatDate: function (date) {
            return date.toLocaleDateString();
        }
    },
    extname:".hbs"
});

// Register handlebars as the rendering engine for views
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the HTML form
app.get('/update-user', (req, res) => {

    const id = req.query.id;
    pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {
        // Handle any errors that occur
        if (error) {
            console.error(error);
            res.status(500).send('Internal server error');
            return;
        }
        // Render the 'index' template with the list of users as a context object
        res.render('edit', { users: results.rows[0], layout:false });
    });
    
});

// Update user data in database
app.post('/update-user', (req, res) => {
    /*---------------------------------------
    [TODO] Please complete the implementation
    to be able to update users in PostgreSQL.
    Receving three parameters id, name and email

    Using the query:
    "UPDATE users SET name = $1, email = $2 WHERE id = $3"

    If Failed: Return status code 500 and JSON message:
    {message: "Error Updating data into PostgreSQL"}

    If succeed:
    Redirect to root of the website.
    ----------------------------------------*/

    const name = req.body.name;
    const id = req.body.id;
    const email = req.body.email;
    // Update data into PostgreSQL
    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email,id],
        (error, results) => {
            if (error) {
                console.log(error); res.status(500).json({ message: 'Error update data into PostgreSQL' });
            } else {
                res.redirect("/");
            }
        });

  });

// Delete user data in database
app.get('/delete-user', (req, res) => {
    /*---------------------------------------
    [TODO] Please complete the implementation
    to be able to delete users in PostgreSQL.
    Receving on paramter id

    Using the query:
    "DELETE FROM users WHERE id = $1"

    If Failed: Return status code 500 and JSON message:
    {message: "Error Delete data from PostgreSQL"}

    If succeed:
    Redirect to root of the website.
    ----------------------------------------*/

    
    const id = req.query.id;

    // Update data into PostgreSQL
    pool.query(
        'DELETE FROM users WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                console.log(error); res.status(500).json({ message: 'Error Delete data from PostgreSQL' });
            } else {
                res.redirect("/");
            }
        });


  });

// Handle form submission
app.post('/insert-user', (req, res) => {
    const { name, email } = req.body;
    // Insert data into PostgreSQL
    pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2)',
        [name, email],
        (error, results) => {
            if (error) {
                console.log(error); res.status(500).json({ message: 'Error inserting data into PostgreSQL' });
            } else {
                res.redirect("/");
            }
        });
});


app.get('/', (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        // Handle any errors that occur
        if (error) {
            console.error(error);
            res.status(500).send('Internal server error');
            return;
        }
        // Render the 'index' template with the list of users as a context object
        res.render('index', { users: results.rows, layout:false });
    });
});


// Start the server
app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});