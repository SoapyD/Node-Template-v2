
    //  #####  ######  #######    #    ####### #######        #####   #####  #     #    #    ######   #####  
    // #     # #     # #         # #      #    #             #     # #     # #     #   # #   #     # #     # 
    // #       #     # #        #   #     #    #             #       #     # #     #  #   #  #     # #       
    // #       ######  #####   #     #    #    #####   #####  #####  #     # #     # #     # #     #  #####  
    // #       #   #   #       #######    #    #                   # #   # # #     # ####### #     #       # 
    // #     # #    #  #       #     #    #    #             #     # #    #  #     # #     # #     # #     # 
    //  #####  #     # ####### #     #    #    #######        #####   #### #  #####  #     # ######   #####  

    exports.run = async() => {

        return Promise.all([

            exports.createSquad(
                {
                    type: "tactical squad",
                    unit: "trooper",
                    gun: "blaster",
                    armour: "mid-tier",
                    melee: "bare-hands",
                    upgrades: [
                        {params:{name:"trooper rocket launcher"}},
                        {params:{name:"trooper assault cannon"}}
                    ],
                    special_rules: [],            
                    min_size: 5,
                    max_size: 10,
                }
            ),
            exports.createSquad(
                {
                    type: "heavy squad",
                    unit: "trooper",
                    gun: "rocket launcher",
                    armour: "mid-tier",
                    melee: "none",
                    upgrades: [
                        {params:{name:"trooper laser cannon"}},
                        {params:{name:"trooper rad cannon"}},
                        {params:{name:"trooper assault cannon"}}
                    ],
                    special_rules: [],                
                    min_size: 3,
                    max_size: 5,
                }
            ),

            exports.createSquad(
                {
                    type: "elite squad",
                    unit: "elite",
                    gun: "blaster",
                    armour: "elite",
                    melee: "bare-hands",
                    upgrades: [
                        {params:{name:"elite assault cannon"}},
                        {params:{name:"elite squad leader"}},
                        {params:{name:"elite claws"}},
                    ],
                    special_rules: [],                
                    min_size: 5,
                    max_size: 10,
                }
            ),
            
            /*
            exports.createSquad(
                {
                    type: "assault squad",
                    unit: "assault",
                    armour: "basic",
                    melee: "sword",
                    gun: "pistol",                    
                    upgrades: [
                        {params:{name:"assault claws"}},
                    ],
                    special_rules: [],                
                    min_size: 5,
                    max_size: 10,
                }
            ),            


            
            exports.createSquad(
                {
                    type: "general",
                    unit: "general",
                    gun: "pistol",
                    armour: "basic",
                    melee: "sword",
                    upgrades: [],
                    special_rules: [],                
                    min_size: 1,
                    max_size: 1,
                }
            ),

            

            exports.createSquad(
                {
                    type: "tank",
                    unit: "tank",
                    gun: "rocket launcher",
                    armour: "heavy",
                    melee: "none",
                    upgrades: [],
                    special_rules: [],                
                    min_size: 1,
                    max_size: 1,
                }
            ), 
            exports.createSquad(
                {
                    type: "dread",
                    unit: "dread",
                    gun: "heavy stubber",
                    armour: "heavy",
                    melee: "power fist",
                    upgrades: [],
                    special_rules: [],
                    min_size: 1,
                    max_size: 1,
                }
            ),
            exports.createSquad(
                {
                    type: "scouts",
                    unit: "marine",
                    gun: "bolter",
                    armour: "basic",
                    melee: "sword",
                    upgrades: [{params:{name:"shield generator"}},{params:{name:"rad cannon"}}],
                    special_rules: [{params:{name:"swift"}},{params:{name:"sword dance"}}],
                    min_size: 5,
                    max_size: 10,
                }
            ),        
            */
        ]);    
    }
    
    exports.createSquad = async(options) => {
    
        //Create Squad
        let unit;
        let gun;
        let armour;
        let melee;
        let cost = 0;
        let upgrades;
        let upgrade_array = [];
    
        unit = await databaseHandler.findData({
            model: "Unit"
            ,search_type: "findOne"
            ,params: {name: options.unit}
        })     
    
        gun = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: options.gun}
        })    
        armour = await databaseHandler.findData({
            model: "Armour" 
            ,search_type: "findOne"
            ,params: {name: options.armour}
        })
        melee = await databaseHandler.findData({
            model: "Melee"
            ,search_type: "findOne"
            ,params: {name: options.melee}
        })
        
        cost = unit[0].cost + gun[0].cost + melee[0].cost + armour[0].cost
    
        upgrades = await databaseHandler.findData({
            model: "Upgrade"
            ,search_type: "findOne"
            ,multiple_search: options.upgrades
        })      
    
        upgrade_array = []
        upgrades.forEach((upgrade) => {
            upgrade_array.push(upgrade._id)
        })
    
    
        special_rules = await databaseHandler.findData({
            model: "SpecialRule"
            ,search_type: "findOne"
            ,multiple_search: options.special_rules
        })      
    
        special_rules_array = []
        special_rules.forEach((rule) => {
            special_rules_array.push(rule._id)
        })
    
        list = {
            model: "Squad"
            ,params: [
               {
                    name: options.type,
                    min_size: options.min_size,
                    max_size: options.max_size,
                    unit: unit[0]._id,
                    gun: gun[0]._id,
                    melee: melee[0]._id,
                    armour: armour[0]._id,
                    cost_per_unit: cost,
                    upgrades: upgrade_array,
                    special_rules: special_rules_array,                
                },
            ]
        }
        return Promise.all([databaseHandler.createData(list)])    
    
    }