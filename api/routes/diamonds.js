const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Diamond = require('../models/diamond');


//Missing auth middleware currently, yet to be made

router.get('/',(req,res) => {
    Diamond.find()
    .select('_id shape color clarity price certification') //Filter through unwanted results
    .exec()
    .then( items => {
        const response = {
            count: items.length,
            diamonds: items.map(diamond => {
                return {
                    shape: diamond.shape,
                    color: diamond.color,
                    clarity: diamond.clarity,
                    price: diamond.price,
                    certification: diamond.certification,
                    id: diamond._id,
                    request: {
                        request_type: 'GET', 
                        url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + diamond._id
                    }
                    
                }
            })
        }
        res.status(200).json({response})
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post('/', (req,res) => {
    //Diamond Constructor
    const diamond = new Diamond({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        shape:req.body.shape,
        color:req.body.color,
        clarity:req.body.clarity,
        price:req.body.price,
        certification:req.body.certification,
    })
    diamond
    .save()
    .then( result => {
        res.status(200).json({
            message: 'New Diamond Added Succesfully',
            request: {
                request_type: 'GET', 
                //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + result._id
            }
        })
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;