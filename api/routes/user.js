const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const checkAuth = require('../middleware/check-auth')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

/*
Note: HTTP Is stateless, so we will not be storing sessions or any information about the client
      ,instead we will use a JSON Web Token to authenticate
*/

//Sign up Route
router.post('/signup', (req,res) => {
    //find will return an array of users with this email address
    User.find({email: req.body.email})
    .exec()
    .then( user => {
        if (user.length >= 1) {
            //User Exists & Return 409/Conflict
            res.status(409).json({
                message: 'Email exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err,hash) => { // 10 salting rounds to prevent looking up pw in dictionary table 
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    //Create New user
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user
                    .save()
                    .then( result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'User Created, sign in to receive Authentication token'
                        })
                    })
                    .catch( err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    })
                }
              
            })
        }
    })
})

//Sign In Route
//We want to be ambigious as to why the auth failed in certain cases, therefore 401/Unauthorized is returned 
router.post('/login', (req,res) => {
    User.find({ email: req.body.email})
    //find() returns an array of users
    .exec()
    .then(user => {
        if (user.length < 1) { // No user found
            return res.status(401).json({
                message: "Authentication Failed"
            })
        }
        //Compare the entered password to the one we find in DB
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                //Incorrect PW
                return res.status(401).json({
                    message: "Authentication Failed"
                })
            }
            if (result) {
                //Define the JWT
                const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                }
                ,process.env.SECRET, 
                 {
                   expiresIn: "1h" // 1 hour lifetime 
                 }) 
                return res.status(200).json({
                    message: 'Authentication Successful',
                    token: token,
                    user_id: user[0]._id
                })
            }
            
            res.status(401).json({
                message: "Authentication Failed"
            })

        })

    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

//Delete Route
//Must be logged in to delete a user
//:userId is returned when you sign in
router.delete('/:userId',checkAuth, (req,res) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;