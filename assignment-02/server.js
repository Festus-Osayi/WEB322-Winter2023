/**************** * WEB322 – Assignment 02 * 
I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source * 
(including 3rd party web sites) or distributed to other students. 
* * Name: __Festus Osayi____________________ Student ID: ___170276216___________ Date: ____2-17-2023____________ 
* * Cyclic Web App URL: _https://zany-gold-dove-tam.cyclic.app_____________________
* * GitHub Repository URL: _____________________https://github.com/Festus-Osayi/web322-app
* ********************************************************************************/
/*============================
    require blog service module.
  ============================
*/

let blogService = require('./blog-service')
let path = require('path')


const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
let app = express();

// return the appropratie message..
const serverListener = (err) =>{
    if (err) {
        console.log(err);
    }else {
        console.log(`Express http server listening on Port ${HTTP_PORT}`)
    }
}

// this serves static files..
app.use(express.static(__dirname + '/public'))

blogService.initialize().then(() => {
    app.listen(HTTP_PORT, serverListener);
}).catch((error) => {
    console.error(error + " this is from server.js");
})

// setup a 'route' to listen on the default url path

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/home.html'))
})
// The route "/about" must return the about.html file from the views folder
app.get('/about', (req, res) => {

    res.sendFile(path.join(__dirname, 'views/about.html'));

});

// This route will return a JSON formatted string containing all of the posts within the posts.json file whose published property is set to true (i.e. "published" posts).
app.get('/blog', (req, res) => {
    // // res.header("Content-Type", 'application/json');
    // res.sendFile(path.join(__dirname, 'data/posts.json'));
    blogService.getPublishedPosts().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({ "message": err });
    })
})

// This route will return a JSON formatted string containing all the posts within the posts.json files
app.get('/posts', (req, res) => {
    blogService.getAllPosts().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({ "message": err });
    })
})

// This route will return a JSON formatted string containing all the categories within the categories.json file
app.get('/categories', (req, res) => {
    blogService.getCategories().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({ "message": err });
    })
});

// return the appropraite error message when a use key in a wrong url..
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/error.html'))
    
});






