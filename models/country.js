const mongoose = require("mongoose");


const countrySchema = new mongoose.Schema({
	name: String
    ,order: Number
});


module.exports = mongoose.model("Country", countrySchema);