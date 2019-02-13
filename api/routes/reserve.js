const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Diamond = require('../models/diamond');
const Reservation = require('../models/reserves');
const checkAuth = require('../middleware/check-auth');
const currentDate = require('../middleware/getDate')

router.get('/', (req, res) => {
    //mongoose .find() method returns all results
    Reservation.find()
        .select('diamond owner _id date')
        .populate('diamond', '_id price carat')
        .exec()
        .then(results => {
            res.status(200).json({
                count: results.length,
                reservations: results.map(result => {
                    return {
                        reservation_id: result._id,
                        reserved_on: result.date,
                        diamond: result.diamond,
                        //owner will be diamond.owner but for now will be a string
                        owner: result.owner
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

            const reservation = new Reservation({
                _id: mongoose.Types.ObjectId(),
                diamond: req.body.diamondId,
                //owner should be populated from verifying the token
                //and returning the email associated with it
                //instead of req.body.ownerId
                owner: req.userData.email,
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
                    owner: result.owner
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
router.get('/:reservationId', (req, res) => {
    Reservation.findById(req.params.reservationId)
        .populate('diamond', '_id shape color clarity carat price certification ') // return full diamond information minus _v0
        .exec()
        .then(reservation => {
                if (!reservation) {
                    return res.status(404).json({
                        message: "Reservation not found"
                    })
                }
                res.status(200).json({
                    reservation: reservation,
                    request: {
                        type: 'GET',
                        message: 'See all reservations',
                        url: 'coming soon'
                    }
                })
            })
        .catch(err => {
                res.status(500).json({
                    error: err
                })
        })
})


//Delete reservation
//In future will have update the field on the Diamond schema reserved: y/n
router.delete('/:reservationId', (req,res) => {
    Reservation.remove({_id: req.params.reservationId})
    .exec()
    .then( result => {
        console.log(result)
        res.status(200).json({
            message: "Reservation Removed",
            request: {
                type: 'POST',
                description: 'Make a reservation',
                url: 'Coming soon',
                params: { diamondId: 'Diamond ID'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})



module.exports = router;