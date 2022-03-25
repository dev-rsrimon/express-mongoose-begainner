const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
const todoSchema = require('../models/todoSchema')
const userSchema = require('../models/userSchema')
const checkLogin = require('../middlewares/checkLogin')
const Todo = new mongoose.model('Todo', todoSchema);
const User = new mongoose.model('User', userSchema);


router.get('/', checkLogin, (req, res) => {
    Todo.find({})
    .populate("user", "name username -_id")
    .select({
        _id: 0,
        date: 0,
    })
    .limit(20)
    .exec((err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!"
            })
        } else {
            res.status(200).json(data)
        }
    })

})

router.get('/js', async (req, res) => {
    const data = await Todo.findByJS()

    res.status(200).json(data)
})

router.get('/active', (req, res) => {
    const todo = new Todo()
    // const data = await todo.findActive();
    
    // res.status(200).json(data)

    todo.findActiveCallback((err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!"
            })
        } else {
            res.status(200).json(data)
        }          
    })
})

router.get('/language', async (req, res) => {
    const data = await Todo.find().byLanguage("react");
    
    res.status(200).json(data)
})

router.get('/:id', (req, res) => {
    Todo.find({_id: req.params.id}, (err, data) => {
        if (err) {
            res.status(500).json("There was server side eiror!")
        } else{
            res.status(200).json(data)
        }
    })
})

router.post('/', checkLogin, async (req, res) => {
    const newTodo = new Todo({
        ...req.body,
        user: req.userId
    });

    try {
        const todo = await newTodo.save()
        await User.updateOne({
            _id: req.userId
        }, {
            $push: {
                todos: todo._id
            }
        })

        res.status(201).json({
            message: "Data save successfully!"
        })        
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!"
        })
    }

})

router.post('/all', (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json('There was a sever side error!')
        } else {
            res.status(200).json("Datas inserted successfully!")
        }
    })
})

router.put('/:id', (req, res) => {
    Todo.findByIdAndUpdate({_id: req.params.id}, {
        $set: req.body
    },
    {
        new: true
    },
    (err, data) => {
        if (err) {
            res.status(500).json("There was a server side error!")
        } else{
            res.status(200).json({
                data,
                message: 'Data Updated successfylly!'
            })
        }
    })


})

router.delete('/:id', (req, res) => {
    Todo.deleteOne({_id: req.params.id}, (err) => {
        if (err) {
            res.status(500).json("There was sever side error!")
        } else {
            res.status(200).json('Data deleted successfully!')
        }
    })
})

module.exports = router