const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Diamond = require('../models/diamond');


//Missing auth middleware currently, yet to be made

//Get Route (Returns all Diamonds)
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

//Post Route
router.post('/', (req,res) => {
    //Diamond Constructor
    const diamond = new Diamond({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        shape:req.body.shape,
        color:req.body.color,
        clarity:req.body.clarity,
        carat:req.body.carat,
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
                url: 'Coming Soon'
            }
        })
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
})

//Get Route (Returns one Diamond)
router.get('/:diamondId', (req,res) => {
    const id = req.params.diamondId;
    Diamond.findById(id)
    //Filter Results (omitting _v0)
    .select('_id shape color clarity price certification')
    .exec()
    .then(diamond => {
        console.log(diamond)
        if (diamond) {
            res.status(200).json({
                diamond: diamond,
                request: {
                    type: 'GET',
                    description: 'See All Diamonds',
                    url: 'Coming Soon'
                }
            })
        } else {
            res.status(404).json({message: "No valid entry for provided Diamond Id"})
        }
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.patch('/:diamondId', (req,res) => {
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
    Diamond.update({_id:id}, {$set: updateParams})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Diamond updated",
            request: {
                type: 'GET',
                description: 'See Updated Diamond',
                url: 'Coming Soon'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.delete("/:diamondId", (req,res) => {
    const id = req.params.diamondId;
    Diamond.remove({_id: id})
    .exec()
    .then(diamond => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                type: 'POST',
                message: 'Post Request Instructions',
                url: 'Coming Soon',
                body: {
                    name: 'String',
                    shape:'String',
                    color:'String',
                    clarity:'String',
                    carat:'Number',
                    price:'Number',
                    certification:'String'
                }
            }
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