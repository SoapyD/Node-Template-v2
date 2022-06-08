
//  #####  ######  #######    #    ####### #######       #######    #     #####  ####### ### ####### #     #  #####  
// #     # #     # #         # #      #    #             #         # #   #     #    #     #  #     # ##    # #     # 
// #       #     # #        #   #     #    #             #        #   #  #          #     #  #     # # #   # #       
// #       ######  #####   #     #    #    #####   ##### #####   #     # #          #     #  #     # #  #  #  #####  
// #       #   #   #       #######    #    #             #       ####### #          #     #  #     # #   # #       # 
// #     # #    #  #       #     #    #    #             #       #     # #     #    #     #  #     # #    ## #     # 
//  #####  #     # ####### #     #    #    #######       #       #     #  #####     #    ### ####### #     #  #####  


exports.run = async() => {


    return Promise.all([
        exports.createFaction(
            {
                name: "space marines",
                description: "big, burley, bruising murder men",
                squads: [
                    {params:{name:"tactical squad"}},
                    {params:{name:"heavy squad"}},
                    {params:{name:"elite squad"}},
                    // {params:{name:"general"}},
                    // {params:{name:"scouts"}},
                    // {params:{name:"tank"}},   
                    // {params:{name:"dread"}},                                        
                ],
            }
        ),
        // exports.createFaction(
        //     {
        //         name: "Test",
        //         description: "test force",
        //         squads: [{name:"heavy squad"}],
        //     }
        // ),        
        ]);

}

exports.createFaction = async(options) => {

	let squads = await databaseHandler.findData({
		model: "Squad"
		,search_type: "find"
		,multiple_search: options.squads
	})   

    let squad_array = []
    squads.forEach((squad) => {
        squad_array.push(squad[0]._id)
    })

    let list = {
        model: "Faction"
        ,params: [
           {
                name: options.name,
                description: options.description,
                squads: squad_array,
            },
        ]
    }
    return Promise.all([databaseHandler.createData(list)])   

}