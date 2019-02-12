const mongoose = require('mongoose');

//Schema for a diamond
const diamondSchema = mongoose.Schema({
    //All diamonds are assigned an ID
    _id: mongoose.Schema.Types.ObjectId,
    shape: {type: String, required: true}, // Round
    color: {type: String, required: true}, // F
    clarity: {type: String, required: true}, // SI2
    price: {type: Number, required: true}, // $5000
    certification: {type: String} // GIA

})

module.exports = mongoose.model('Diamond', diamondSchema)