const mongoose = require("mongoose");


const errorSchema = new mongoose.Schema({
	class: String
	,function: String
	,e: {
		message: String,
		stack: String
	}
	,detail: String
    ,created_date: {type: Date, default: Date.now}
});


module.exports = mongoose.model("error", errorSchema);