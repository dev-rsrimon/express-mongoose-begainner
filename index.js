const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoController = require('./controllers/todoController')
const authController = require('./controllers/authController')

// express app initailazation
const app = express()
dotenv.config()
app.use(express.json()) 

// mongoose connection 
mongoose.connect('mongodb://localhost/todos')
    .then(() => console.log('Database is connnect'))
    .catch(err => console.log(err))

// app routes
app.use('/todo', todoController)
app.use('/auth', authController)

// default error handler
const errorHanlder = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    res.status(500).json({error: err})
}

app.use(errorHanlder)

// server
app.listen(3000, ()=> {
    console.log(`Sever started listen port 3000`);
})
