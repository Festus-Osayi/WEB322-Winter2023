const express = require('express');
const exphbs = require('express-handlebars');
const config = require('./config');
const todosModel = require("./todosModel")
const Handlebars = require('handlebars')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const connectionString = config.database_connection_strings

const app = express();


app.engine('.hbs', exphbs.engine({ extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use(express.static('public'));


//checking the connection and,
// connecting to the database
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })

// console log when the DB is connected
mongoose.connection.on("open", () => {
  console.log("connection successfully");
});




// Routes
app.get('/', async (req, res) => {

  todosModel.find().sort({ "_id": 1 }).exec().then((data) => {

    res.render('index', { todos: data, layout: false })
    

  }).catch(err => {
    res.send(err)
  })

});


// for adding a new task
app.post('/add', async (req, res) => {
  const task = req.body.task;


  let insertTodos = new todosModel({
    task: task,
    completed: false
  })

  insertTodos
    .save(insertTodos).then(() =>
      res.redirect('/')
    )



});

// completing a task route, if a user complates a set of tasks..
app.post('/complete/:id', async (req, res) => {
  const id = req.params.id;

  todosModel.updateOne({ _id: id }, { $set: { completed: true } }).exec().then(data => {
    if (!data) {
      res.status(400).send({ message: "cannot update a user with specified id" })
    } else {
      res.redirect('/');
    }
  }).catch(() => {
    res.send({ message: "ERRR!" })
  })


});


// route to edit a tasks..
app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;



  todosModel.find({ _id: id }).exec().then(data => {
    if (data) {
      res.status(200).render('edit', { todo: data[0], layout: false });


    } else {
      res.send({ message: "ERROR!!" })
    }

  }).catch(() => {
    res.status(500).send({ message: "Unfortunately! unable to edit a user" })
    res.redirect('/');
  })
});


// updates..
app.post('/update/:id', async (req, res) => {
  const id = req.params.id;
  const task = req.body.task;

  todosModel.updateOne({ _id: id }, { $set: { task: task } })
  .exec().then((data) => {
    if (data) {
      res.redirect('/');
    }
    else {
      res.send({ message: "ERROR!!" })
    }
  }).catch(() => {
    res.send({ message: [] })
  })

});

// Add this route after the existing routes
app.post('/delete/:id', async (req, res) => {
  const id = req.params.id;

  todosModel.deleteOne({_id: id}).exec().then(data=>{
    if(data){
      res.redirect('/');
    }else{
      res.send({message: "unable to delete a user, with the specified id"})
    }
  }).catch(err=> {
    res.send(err)
  })

  
});

// port to listen on (8080)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});