




//  #####  ####### #######          #    #       #       
// #     # #          #            # #   #       #       
// #       #          #           #   #  #       #       
// #  #### #####      #    ##### #     # #       #       
// #     # #          #          ####### #       #       
// #     # #          #          #     # #       #       
//  #####  #######    #          #     # ####### ####### 
                                                      

exports.getAll = async(req,res) => {

    try{

        let options = {
            model: 'DynamicRoute'
            ,search_type: "find"
        }
        let route_info = await databaseHandler.findData(options)


        let view = "admin/index"
        res.render(view, {title:"Admin", stylesheet: view, route_info: route_info[0]});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get admin data");
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

exports.getSingle = async(req,res) => {

    try{

        let find_options = {
            model: 'DynamicRoute'
            ,search_type: "find"
        }
        let route_info = await databaseHandler.findData(find_options)        

        let item = req.params.item;
        let route = route_info[0][item];

        let options = {
            model: route.model
            ,search_type: "find"
        }
        if(route.sort){
            options.sort = JSON.parse(route.sort)
        }

        let data = await databaseHandler.findData(options)


        let view = 'admin/show'
        res.render(view, {route_id: item, route:route, stylesheet: view, data: data[0]});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get item data");
        res.redirect("/")        
    }    
}

//  #####  ####### #######       ####### ####### ######  #     #        #####  ######  #######    #    ####### ####### 
// #     # #          #          #       #     # #     # ##   ##       #     # #     # #         # #      #    #       
// #       #          #          #       #     # #     # # # # #       #       #     # #        #   #     #    #       
// #  #### #####      #    ##### #####   #     # ######  #  #  # ##### #       ######  #####   #     #    #    #####   
// #     # #          #          #       #     # #   #   #     #       #       #   #   #       #######    #    #       
// #     # #          #          #       #     # #    #  #     #       #     # #    #  #       #     #    #    #       
//  #####  #######    #          #       ####### #     # #     #        #####  #     # ####### #     #    #    ####### 

exports.getFormCreate = async(req,res) => {
    
    try{

        let find_options = {
            model: 'DynamicRoute'
            ,search_type: "find"
        }
        let route_info = await databaseHandler.findData(find_options)

        let item = req.params.item;
        let route = route_info[0][item];


        let multiple_search = []
        let sub_data = []
        if(route.sub_data){
            route.sub_data.forEach( async(model) => {
                multiple_search.push({
                    model: model
                })
            })

            options = {
                model: ""
                ,sort: ""
                ,search_type: "find"
                ,multiple_search
            }
    
            sub_data = await databaseHandler.findData(options)
            for(i=0;i<sub_data.length;i++){
                sub_data[i].model = route.sub_data[i]
            }
        }

        let view = 'admin/edit'
        res.render(view, {route_id: item, route:route, stylesheet: view, data: undefined, sub_data: sub_data});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get data");
        res.redirect("/")        
    }
};

//  #####  ######  #######    #    ####### ####### 
// #     # #     # #         # #      #    #       
// #       #     # #        #   #     #    #       
// #       ######  #####   #     #    #    #####   
// #       #   #   #       #######    #    #       
// #     # #    #  #       #     #    #    #       
//  #####  #     # ####### #     #    #    ####### 

exports.create = async(req,res) => {

    let item = req.params.item;    

	try{

        let find_options = {
            model: 'DynamicRoute'
            ,search_type: "find"
        }
        let route_info = await databaseHandler.findData(find_options)

        let route = route_info[0][item];

		let data = await databaseHandler.createData({
			model: route.model
			,params: [
				req.body
			]
		})
	
		res.redirect("/admin/"+ item)  	
	}catch(err){
		req.flash("error", "There was an error trying to create your army list"); 
		res.redirect("/admin/"+ item)
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
    
    try{

        let find_options = {
            model: 'DynamicRoute'
            ,search_type: "find"
        }
        let route_info = await databaseHandler.findData(find_options)

        let item = req.params.item;
        let route = route_info[0][item];
        let id = req.params.id;


        let options = {
            model: route.model
            ,search_type: "find"
            ,params: {"_id": id }
        }
        if(route.sort){
            options.sort = route.sort
        }

        let data = await databaseHandler.findData(options)


        let multiple_search = []
        let sub_data = []
        if(route.sub_data){
            route.sub_data.forEach( async(model) => {
                multiple_search.push({
                    model: model
                })
            })

            options = {
                model: ""
                ,sort: ""
                ,search_type: "find"
                ,multiple_search
            }
    
            sub_data = await databaseHandler.findData(options)
            for(i=0;i<sub_data.length;i++){
                sub_data[i].model = route.sub_data[i]
            }
        }

        let view = 'admin/edit'
        res.render(view, {route_id: item, route:route, stylesheet: view, data: data[0][0], sub_data: sub_data});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get data");
        res.redirect("/")        
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

    let item = req.params.item;

	try{
    
        let find_options = {
            model: 'DynamicRoute'
            ,search_type: "find"
        }
        let route_info = await databaseHandler.findData(find_options)        

        let route = route_info[0][item];
        let id = req.params.id;
        
        let params = req.body

		let record = await databaseHandler.findData({
			model: route.model
			,search_type: "findOne"
			,params: {_id: id}
		})
	
		let options = {
			model: route.model,
			params: []
		}
		options.params.push(params)
	
		let updated = await databaseHandler.updateData(record[0], options)
	
        req.flash("success", "Army Updated"); 
		res.redirect("/admin/"+item)	
	}catch(err){
		req.flash("error", "There was an error trying to save your army list"); 
		res.redirect("/admin/" +item)
	}

}


// ######  ####### #       ####### ####### ####### 
// #     # #       #       #          #    #       
// #     # #       #       #          #    #       
// #     # #####   #       #####      #    #####   
// #     # #       #       #          #    #       
// #     # #       #       #          #    #       
// ######  ####### ####### #######    #    ####### 


exports.delete = async(req,res) => {

    let item = req.params.item;

	try{
    
        let find_options = {
            model: 'DynamicRoute'
            ,search_type: "find"
        }
        let route_info = await databaseHandler.findData(find_options)        

        let route = route_info[0][item];
        let id = req.params.id;        

		let data = await databaseHandler.destroyData({
			model: route.model
			,params: [{_id: id}]
		})
	
		res.redirect("/admin/" +item)	
	}catch(err){
        req.flash("error", "There was an error trying to delete your army list"); 
        console.log(err)
		res.redirect("/admin/" +item)
	}
};