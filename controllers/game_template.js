
exports.getGameRoom = async(req,res) => {

	let data = {
		instance_type: process.env.INSTANCE_TYPE,
	}

	//CREATE ROOM IF THIS IS A DEV INSTANCE
	switch(process.env.INSTANCE_TYPE){
		case "DEV":
			let options = {
				user: "6069bd7bc7b18a43c84292b4", //a user id we can user as an author
				user_name: "test",
				players: 2, //max players
				room_name: "test room",
				password: ""

			}
			// let room = await databaseHandler.createRoom(options, "network.socket.id")
			let room = {}
			room.forces = []
			room.forces.push({})

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

			data.room = room;
			data.armies = armies;
			break;
	}



	res.render("game_template/game_view", {title:"Game Room Template",data: data});
}