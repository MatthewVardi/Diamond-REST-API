const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config() // Hide sensitive information
const diamondRoutes = require('./api/routes/diamonds')
const userRoutes = require('./api/routes/user')
const reserveRoutes = require('./api/routes/reserve')

//Connect to MongoDB hosted on mLab
//ENV Variables for authentication as DB Owner 
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds131905.mlab.com:31905/diamondapi`, { useNewUrlParser: true })

//Set up for Body-Parser to accept the data in our requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Adjust the header response to allow different/any clients to connect to my server 
//And Prevent CORS errors 
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin X-Requested-With, Content-Type, Accept, Authorization")
    
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    //If not returning immedeatly, then we call next to our other routes can be reached
    next();
})

//Diamond Routes
app.use('/diamonds', diamondRoutes);
//User Routes
app.use('/user', userRoutes);
//Reserve Routes
app.use('/reserve', reserveRoutes);



//Default error
app.use((req,res,next) => {
    const error = new Error('Not a valid endpoint');
    error.status = 404;
    next(error);
})

//Other Errors from DB
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;