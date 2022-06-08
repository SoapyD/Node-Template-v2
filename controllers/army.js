
//  #####  ####### #######          #    #       #       
// #     # #          #            # #   #       #       
// #       #          #           #   #  #       #       
// #  #### #####      #    ##### #     # #       #       
// #     # #          #          ####### #       #       
// #     # #          #          #     # #       #       
//  #####  #######    #          #     # ####### ####### 
                                                      

exports.getAll = async(req,res) => {

	try{
		//get all products from DB
		let items = await databaseHandler.findData({
			model: "Army"
			,search_type: "find"
			// ,params: [
			// 	{name: "test"}
			// ]
		})
	
		res.render("army/index",{armies: items[0]})
	}catch(err){
		req.flash("error", "There was an error trying to retrieve the army builder"); 
		res.redirect("/")
	}
};


//  #####  ####### #######        #####  ### #     #  #####  #       ####### 
// #     # #          #          #     #  #  ##    # #     # #       #       
// #       #          #          #        #  # #   # #       #       #       
// #  #### #####      #    #####  #####   #  #  #  # #  #### #       #####   
// #     # #          #                #  #  #   # # #     # #       #       
// #     # #          #          #     #  #  #    ## #     # #       #       
//  #####  #######    #           #####  ### #     #  #####  ####### #######

exports.getSingle = async(req, res) => {

	let id = req.params.id;

	try{
		// let item = await databaseHandler.getArmy({_id: id})		
	
		let item = await databaseHandler.findData({
			model: "Army"
			,search_type: "find"
			,params: {_id: id}
		})

		// let faction  = await databaseHandler.getFaction({_id: item[0][0].faction._id})
	
		let faction = await databaseHandler.findData({
			model: "Faction"
			,search_type: "find"
			,params: {_id: item[0][0].faction._id}
		})

		res.render("army/show",{army: item[0][0], squads: faction[0][0].squads})	
	}catch(err){
		req.flash("error", "There was an error trying to retrieve your army list"); 
		console.log(err)
		res.redirect("/army/")
	}
};

//  #####  ####### #######       ####### ######  ### ####### 
// #     # #          #          #       #     #  #     #    
// #       #          #          #       #     #  #     #    
// #  #### #####      #    ##### #####   #     #  #     #    
// #     # #          #          #       #     #  #     #    
// #     # #          #          #       #     #  #     #    
//  #####  #######    #          ####### ######  ###    #  

exports.getEdit = async(req,res) => {

	let id = req.params.id;

	try{
		let item = await databaseHandler.getArmy({_id: id})	
	
		let factions = await databaseHandler.findData({
			model: "Faction"
			,search_type: "find"
		})
	
		res.render("army/edit", {army:item[0], factions: factions[0]});	
	}catch(err){
		req.flash("error", "There was an error trying to delete your army list"); 
		res.redirect("/army/" +req.params.id)
	}
};

//  #####  ####### #######       ####### ####### ######  #     #        #####  ######  #######    #    ####### ####### 
// #     # #          #          #       #     # #     # ##   ##       #     # #     # #         # #      #    #       
// #       #          #          #       #     # #     # # # # #       #       #     # #        #   #     #    #       
// #  #### #####      #    ##### #####   #     # ######  #  #  # ##### #       ######  #####   #     #    #    #####   
// #     # #          #          #       #     # #   #   #     #       #       #   #   #       #######    #    #       
// #     # #          #          #       #     # #    #  #     #       #     # #    #  #       #     #    #    #       
//  #####  #######    #          #       ####### #     # #     #        #####  #     # ####### #     #    #    ####### 

exports.getFormCreate = async(req,res) => { 

	let item = await databaseHandler.findData({
		model: "Faction"
		,search_type: "find"
	})

	res.render("army/new", {factions: item[0]});
};

//  #####  ######  #######    #    ####### ####### 
// #     # #     # #         # #      #    #       
// #       #     # #        #   #     #    #       
// #       ######  #####   #     #    #    #####   
// #       #   #   #       #######    #    #       
// #     # #    #  #       #     #    #    #       
//  #####  #     # ####### #     #    #    ####### 

exports.create = async(req,res) => {
	
	try{
		if(req.user){
	
			let author = {
				id: req.user._id,
				username: req.user.username
			}		
	
			req.body.params.author = author
		}
	
		
		let item = await databaseHandler.createData({
			model: "Army"
			,params: [
				req.body.params
			]
		})
	
		res.redirect("/army/"+ item[0]._id)  	
	}catch(err){
		req.flash("error", "There was an error trying to create your army list"); 
		res.redirect("/army/")
	}

};

// #     # ######  ######     #    ####### ####### 
// #     # #     # #     #   # #      #    #       
// #     # #     # #     #  #   #     #    #       
// #     # ######  #     # #     #    #    #####   
// #     # #       #     # #######    #    #       
// #     # #       #     # #     #    #    #       
//  #####  #       ######  #     #    #    ####### 

exports.update = async(req,res) => {

	try{
		let id = req.params.id;
	
		let item = await databaseHandler.findData({
			model: "Army"
			,search_type: "findOne"
			,params: {_id: id}
		})
	
		let options = {
			model: "Army",
			params: []
		}
		options.params.push(req.body.params)
	
		let updated = await databaseHandler.updateData(item[0], options)
	
		req.flash("success", "Army Updated"); 
		res.redirect("/army/" +req.params.id)	
	}catch(err){
		req.flash("error", "There was an error trying to save your army list"); 
		res.redirect("/army/" +req.params.id)
	}
};

// ######  ####### #       ####### ####### ####### 
// #     # #       #       #          #    #       
// #     # #       #       #          #    #       
// #     # #####   #       #####      #    #####   
// #     # #       #       #          #    #       
// #     # #       #       #          #    #       
// ######  ####### ####### #######    #    ####### 


exports.delete = async(req,res) => {

	let id = req.params.id;

	try{
	
		let item = await databaseHandler.destroyData({
			model: "Army"
			,params: {_id: id}
		})
	
		res.redirect("/army/")		
	}catch(err){
		req.flash("error", "There was an error trying to delete your army list"); 
		res.redirect("/army/" +req.params.id)
	}
};


