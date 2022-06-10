
exports.getGameRoom = async(req,res) => {

	let data = {
		address: process.env.SOCKET_ADDRESS,
		instance_type: process.env.INSTANCE_TYPE,
	}

	//CREATE ROOM IF THIS IS A DEV INSTANCE
	switch(process.env.INSTANCE_TYPE){
		case "DEV":
			let options = {
				max_players: 1, //max players
				name: "test room",
				password: ""

			}

			let user = {
				_id: "6202e2efcbdf8cac8448ad9b", //a user id we can user as an author
				username: "test",
			}

			// let room = await databaseHandler.createRoom(options, "network.socket.id")
			let room = {}
			room.name = options.name
			room.password = options.password
			room.max_players = options.max_players
			room.forces = []
			room.forces.push({})


			let deleted_army = await databaseHandler.destroyData({
				model: "Room"
				,search_type: "deleteMany"
				,params: [{room_name: "test room"}]
			})

			// let army = await databaseHandler.getArmy({name: "Test"})
			let army = await databaseHandler.findData({
				model: "Army"
				,search_type: "find"
				,params: {name: "Test"}
			})

			room.forces[0].side = 0;
			room.forces[0].start = 0;
			room.forces[0].army = army[0]._id;

			// room.forces[1].side = 1;			
			// room.forces[1].start = 1;
			// room.forces[1].army = army[0]._id;
			// room.forces[1].user = "6069bd7bc7b18a43c84292b4";

			// let armies = await databaseHandler.getArmies({forces: room.forces})
			let armies = []
			armies.push(army[0])

			// room.save();

			data.user = user;
			data.room = room;
			data.armies = armies;
			break;
	}



	res.render("game_template/game_view", {title:"Game Room Template",data: data});
}