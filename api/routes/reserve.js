const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Diamond = require('../models/diamond');
const Reservation = require('../models/reserves');
const checkAuth = require('../middleware/check-auth');
const currentDate = require('../middleware/getDate')

//GET all reservations
router.get('/', (req, res) => {
    //mongoose .find() method returns all results
    Reservation.find()
        .select('diamond reserved_by _id date')
        .populate('diamond', '_id name')
        .exec()
        .then(results => {
            res.status(200).json({
                count: results.length,
                reservations: results.map(result => {
                    return {
                        reservation_id: result._id,
                        reserved_on: result.date,
                        reserved_by: result.reserved_by,
                        diamond: result.diamond,
                        see_more: {
                            type: 'GET',
                            description: 'See Specific Reservation',
                            endpoint: '/reserve/' + result._id
                        }
                    }
                })
                
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

//This route will require a Token
//via checkAuth middleware we can access the requesters email (req.userData.email)
//and use it when creating a reservation
router.post('/', checkAuth, (req, res) => {
    //Get date for reservation schema
    const curDate = currentDate();
    //First we verify if the Diamond ID is valid
    Diamond.findById(req.body.diamondId)
        .then(diamond => {
            if (!diamond) {
                return res.status(404).json({
                    message: "Diamond Not Found"
                })
            }
            //Update available field on diamond model before creating reservation
            Diamond.findByIdAndUpdate(req.body.diamondId, { $set: { available: 'No' }}, (err,res) => {
                if (err) {console.log(err)}
                console.log('Response' + res)
            })

            const reservation = new Reservation({
                _id: mongoose.Types.ObjectId(),
                diamond: req.body.diamondId,
                reserved_by: req.userData.email,
                date: curDate
            })
            return reservation.save()
        })
        .then(result => {
            res.status(201).json({
                message: "Reservation Created",
                createdReservation: {
                    reservation_id: result._id,
                    reserved_on: result.date,
                    diamond: result.diamond,
                    reserved_by: result.owner
                },
                see_more: {
                    type: 'GET',
                    description: 'See Specific Reservation',
                    endpoint: '/reserve/' + result._id
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


//Get specific reservation information - contains all diamond info
router.get('/:reservationId',checkAuth, (req, res) => {
    Reservation.findById(req.params.reservationId)
        .populate('diamond', '_id name shape color clarity carat price certification ') 
        // return full diamond information minus _v0
        .exec()
        .then(reservation => {
                if (!reservation) {
                    return res.status(404).json({
                        message: "Reservation not found"
                    })
                }
                res.status(200).json({
                    reservation: reservation,
                    see_more: {
                        type: 'GET',
                        description: 'See All Reservations',
                        endpoint: '/reserve'
                    }
                })
            })
        .catch(err => {
                res.status(500).json({
                    error: err
                })
        })
})


//Delete reservation route
router.delete('/:reservationId',checkAuth, (req,res) => {
    //Update available field on diamond model before deleting reservation
    Diamond.findByIdAndUpdate(req.body.diamondId, { $set: { available: 'Yes' }}, (err,res) => {
        if (err) {console.log(err)}
        console.log('Response ' + res)
    })

    Reservation.findById({_id: req.params.reservationId})
    .exec()
    .then( result => {
        if (!result) {
            return res.status(404).json({
                message: "Reservation Not Found"
            })  
        }
        Reservation.remove({_id: req.params.reservationId})
        .exec()
        .then(remres => {
            res.status(200).json({
                message: "Reservation Removed",
                see_more: {
                    type: 'GET',
                    description: 'See All Reservations',
                    endpoint: '/reserve'
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})



module.exports = router;