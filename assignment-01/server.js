/********************************************************************************* * WEB322 – Assignment 1 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. * * Name: __Festus Osayi____________________ Student ID: __170276216____________ Date: _____18-01-2023___________ * * Online (Cyclic) URL: _______________________________________________________ * ********************************************************************************/

const express = require('express')
const HTTP_PORT = process.env.port || 8080
const app = express()

//setting up the defaults route.

app.get('/', (req, res)=>{
    res.send('Festus Osayi-170276216')
})

//route to listen to.
app.listen(HTTP_PORT, function(){
    console.log(`listening on port ${HTTP_PORT}`)
})