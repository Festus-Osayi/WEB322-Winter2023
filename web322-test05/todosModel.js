const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todos = new Schema({

    task: {
        type: String
    },
    completed: Boolean
})

module.exports = mongoose.model('todos', todos)