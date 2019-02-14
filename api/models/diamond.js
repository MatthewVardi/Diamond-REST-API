const mongoose = require('mongoose');

//Schema for a diamond
const diamondSchema = mongoose.Schema({
    //All diamonds are assigned an ID
    _id: mongoose.Schema.Types.ObjectId,
    name: String, //Round 1.00 F SI2
    shape: {type: String, required: true}, // Round
    color: {type: String, required: true}, // F
    clarity: {type: String, required: true}, // SI2
    carat: {type: Number, required: true}, //1.00
    price: {type: Number, required: true}, // $5000
    certification: {type: String}, // GIA
    available: {type: String, default: 'Yes'} // yes/no

})

module.exports = mongoose.model('Diamond', diamondSchema)