const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Diamond = require('../models/diamond');
const checkAuth = require('../middleware/check-auth')


//Missing auth middleware currently, yet to be made

//Get Route (Returns all Diamonds)
router.get('/', (req, res) => {
    Diamond.find()
        .select('_id name shape color carat clarity price certification available') //Filter through unwanted results
        .exec()
        .then(items => {
            const response = {
                count: items.length,
                diamonds: items.map(diamond => {
                    return {
                        name: diamond.name,
                        available: diamond.available,
                        // shape: diamond.shape,
                        // color: diamond.color,
                        // clarity: diamond.clarity,
                        // carat: diamond.carat,
                        // price: diamond.price,
                        // certification: diamond.certification,
                        id: diamond._id,
                        see_more: {
                            request_type: 'GET',
                            description: 'See Specific Diamond',
                            endpoint: '/diamonds/' + diamond._id
                        }

                    }
                })
            }
            res.status(200).json({
                response
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

//Post Route
router.post('/', checkAuth, (req, res) => {
    //Diamond Constructor
    const diamond = new Diamond({
        _id: new mongoose.Types.ObjectId(),
        name: `${req.body.shape} Cut ${req.body.carat} CT ${req.body.color} ${req.body.clarity}`,
        shape: req.body.shape,
        color: req.body.color,
        clarity: req.body.clarity,
        carat: req.body.carat,
        price: req.body.price,
        certification: req.body.certification,
    })
    diamond
        .save()
        .then(result => {
            res.status(200).json({
                message: 'New Diamond Added Succesfully',
                see_more: {
                    request_type: 'GET',
                    diamond_id: result._id,
                    description: 'See Specific Diamond',
                    //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                    endpoint: '/diamonds/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

//Get Route (Returns one Diamond)
router.get('/:diamondId', (req, res) => {
    const id = req.params.diamondId;
    Diamond.findById(id)
        //Filter Results (omitting _v0)
        .select('_id name shape color clarity carat price certification available')
        .exec()
        .then(diamond => {
            console.log(diamond)
            if (diamond) {
                res.status(200).json({
                    diamond: diamond,
                    see_more: {
                        type: 'GET',
                        description: 'See All Diamonds',
                        endpoint: '/diamonds'
                    }
                })
            } else {
                res.status(404).json({
                    message: "No valid entry for provided Diamond Id"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

//Patch/Update Route
router.patch('/:diamondId',checkAuth, (req, res) => {
    const id = req.params.diamondId;
    //Updated fields will be in req.body
    //We populate this object with the data
    /*
    [
        {
            EXAMPLE PATCH REQUEST
            "propName": "certification",
            "value": "no"
        }
    ]
    */
    const updateParams = {};
    //Array of objects with updated properties
    for (const ops of req.body) {
        updateParams[ops.propName] = ops.value
    }
    Diamond.update({
            _id: id
        }, {
            $set: updateParams
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Diamond updated",
                see_more: {
                    type: 'GET',
                    description: 'See Updated Diamond',
                    endpoint: '/diamonds/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})


//Delete Route
router.delete("/:diamondId",checkAuth, (req, res) => {
    const id = req.params.diamondId;
    Diamond.findById({_id: id})
    .exec()
    .then(diamond => {
        if (!diamond) {
            return res.status(404).json({
                message: "Diamond Not Found"
            })
        }
        Diamond.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted',
                see_more: {
                    type: 'GET',
                    Description: 'See All Diamonds',
                    endpoint: '/diamonds'
                }
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
module.exports = router;