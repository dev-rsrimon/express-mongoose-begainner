const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userSchema = require('../models/userSchema')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = new mongoose.model('User', userSchema)


router.post('/signup', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashPassword
        })

        await newUser.save()
        res.status(200).json({
            message: "Signup was successful!"
        })
    } catch (error) {
        res.status(500).json({
            error: "Signup failed!"
        })
    }
})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.find({username: req.body.username});

        if (user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password)
            if (isValidPassword) {
                // generate token
                const token = jwt.sign({
                    username: user[0].username,
                    name: user[0].name,
                    userId: user[0]._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                })

                res.status(200).json({
                    access_token: token,
                    message: "Signin Successful!"
                })

            } else {
                res.status(401).json({
                    error: "Authentication faild!"
                }) 
            }

        } else {
            res.status(401).json({
                error: "Authentication faild!"
            })
        }
    } catch (error) {
        res.status(401).json({
            error: "Authentication faild!"
        })
    }
})

// get all user todos
router.get('/user/all', async (req, res) => {
    try {
        const users = await User.find({
            status: 'active'
        }).populate('todos')
        
        res.status(200).json({
            data: users,
            message: "success!"
        })
        
    } catch (err) {
        res.status(500).json("There was server side eiror!")
    }
})

router.get('/user', (req, res) => {


})

router.put('/user/update', (req, res) => {

})

router.delete('/user/delete', (req, res) => {

})

module.exports = router