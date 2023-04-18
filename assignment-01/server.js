/**************** * WEB322 – Assignment 05 * 
I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part * of this assignment has been copied manually or electronically from any other source * 
(including 3rd party web sites) or distributed to other students. 
* * Name: __Festus Osayi____________________ Student ID: ___170276216___________ Date: ____2-17-2023____________ 
* * Cyclic Web App URL: _https://zany-gold-dove-tam.cyclic.app_____________________
* * GitHub Repository URL: _____________________https://github.com/Festus-Osayi/web322-app
* ********************************************************************************/
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
