/********************************************************************************* * WEB322 – test 04 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * of this assignment has been copied manually or electronically from any other source * (including 3rd party web sites) or distributed to other students. * * Name: __Festus Osayi____________________ Student ID: ___170276216___________ Date: ____3-24-2023____________ * * Cyclic Web App URL: https://zany-ruby-penguin-tie.cyclic.app___________________________________________________ * * GitHub Repository URL: _____________________https://github.com/Festus-Osayi/web322-app_________________________________ * ********************************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const Sequelize = require("sequelize")



// set up sequelize to point to our postgres database
var sequelize = new Sequelize('oowbogjv', 'oowbogjv', '3a9fGnJ8HkINuHiPcfS6lLHtBPDwuZEI', {
    host: 'isilo.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize
    .authenticate()
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });


var users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true // automatically increment the value
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    created_at: Sequelize.DATE
}, {
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});


// Load styles from public folder
app.use(express.static("./public/"));

// Define a custom Handlebars helper function to format dates
const hbs = exphbs.create({
    helpers: {
        formatDate: function (date) {
            return date.toLocaleDateString();
        }
    },
    extname: ".hbs"
});

// Register handlebars as the rendering engine for views
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the HTML form
app.get('/update-user', (req, res) => {

    const id = req.query.id;
    const { name, email } = req.body

    users.findAll({
        where: { id: id }
    }).then(function (data) {
        res.render('edit', { users: data[0], layout: false })
    }).catch(err => {
        console.log(err);
    })


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
    users.update({
        name: name,
        email: email,

        where: { id: id }
    }).then(function () {
        console.log(`users updated with ${id} updated`)
    }).catch(err => {
        console.log('err')
    })
    res.redirect('/')

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



    users.destroy({
        where: { id: id }
    }).then(function () {
        console.log(`deleted successfully`)
    }).catch(err => {
        console.log(err)
    })
    res.redirect('/')


});

// Handle form submission
app.post('/insert-user', (req, res) => {
    const { name, email } = req.body;
    // Insert data into PostgreSQL

    users.create({
        name: name,
        email: email,

    }).then(function () {
        console.log(`successfully`)
        res.redirect('/')
    }).catch(err => {
        console.log('err')
    })


})
app.get('/', (req, res) => {

    users.findAll({
        order: ["id"]
    }).then((data) => {
        // render the "viewTable" view with the data
        res.render('index', { users: data, layout: false });
    });
});


// Start the server
sequelize.sync().then(function () {
    app.listen(8080, () => {
        console.log('Server started on http://localhost:8080');
    });
})
