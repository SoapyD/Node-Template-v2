const mongoose = require("mongoose");


const specialRuleSchema = new mongoose.Schema({
	name: String
	,description: String
});


module.exports = mongoose.model("SpecialRule", specialRuleSchema);