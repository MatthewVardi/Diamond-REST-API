const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Missing auth middleware currently, yet to be made

router.get('/',(req,res,next) => {
    res.status(200).json({
        message: 'Made it to get route'
    })
})

module.exports = router;