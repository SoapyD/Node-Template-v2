
exports.getGameRoom = async(req,res) => {

	let data = {
		instance_type: process.env.INSTANCE_TYPE,
	}


	res.render("game_template/game_view", {title:"Game Room Template",data: data});
}