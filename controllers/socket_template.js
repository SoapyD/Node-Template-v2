

exports.getEurovision = async(req,res) => {

	let data = {
		address: process.env.SOCKET_ADDRESS,
		instance_type: process.env.INSTANCE_TYPE,
	}

	let countries = await databaseHandler.findData({
		model: "Country"
		,search_type: "find"
		,sort: {order: "asc"}
	})	


	res.render("socket_template/eurovision", {countries: countries[0], data: data});
}


exports.getSocketRoom = async(req,res) => {

	let data = {
		address: process.env.SOCKET_ADDRESS,
		instance_type: process.env.INSTANCE_TYPE,
	}


	res.render("socket_template/socket_view", {title:"Socket Room Template",data: data});
}