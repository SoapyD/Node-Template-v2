const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({
	room_name: String
	,password: String
	,sockets: [String]
    ,users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]

	,author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		user_name: String
    }

   ,created_date: {type: Date, default: Date.now}
   ,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Room", roomSchema);