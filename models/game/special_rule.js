const mongoose = require("mongoose");


const specialRuleSchema = new mongoose.Schema({
	name: String
	,description: String

	,function: String
	,mode: String
	,value: {type: Number, default: 0}
	,chance: {type: Number, default: 0}
});


module.exports = mongoose.model("SpecialRule", specialRuleSchema);