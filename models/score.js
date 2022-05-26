const mongoose = require("mongoose");


const scoreSchema = new mongoose.Schema({
	username: String
    ,scores: [{
        country: String,
        song_personal: {type: Number, default: 0},
        staging_personal: {type: Number, default: 0},
    }]
});


module.exports = mongoose.model("Score", scoreSchema);