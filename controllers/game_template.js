
exports.getGameRoom = async(req,res) => {

	let data = {
		address: process.env.SOCKET_ADDRESS,
		instance_type: process.env.INSTANCE_TYPE,
	}

	//CREATE ROOM IF THIS IS A DEV INSTANCE
	switch(process.env.INSTANCE_TYPE){
		case "DEV":
			let options = {
				max_players: 2, //max players
				name: "test room",
				password: ""

			}

			let user = {
				_id: "5f359b5da428ff4ea8c13bb5", //a user id we can user as an author
				username: "admin",
			}

			// let room = await databaseHandler.createRoom(options, "network.socket.id")
			let room = {}
			room.name = options.name
			room.password = options.password
			room.max_players = options.max_players


			let deleted_room = await databaseHandler.destroyData({
				model: "Room"
				,search_type: "deleteMany"
				,params: [{room_name: "test room"}]
			})


			data.user = user;
			data.room = room;
			break;
	}



	res.render("game_template/game_view", {title:"Game Room Template",data: data});
}