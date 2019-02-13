const mongoose = require('mongoose');

//Each reservation will include its own ID and a refrence to the Diamond & the owner
const reserveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    diamond: { type: mongoose.Schema.Types.ObjectId, ref: 'Diamond', required: true}, 
    owner: { type: String },
    date: {type: String}
})

module.exports = mongoose.model("Reserve", reserveSchema);