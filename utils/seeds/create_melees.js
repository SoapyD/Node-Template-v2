

//  #####  ######  #######    #    ####### #######       #     # ####### #       ####### ####### 
// #     # #     # #         # #      #    #             ##   ## #       #       #       #       
// #       #     # #        #   #     #    #             # # # # #       #       #       #       
// #       ######  #####   #     #    #    #####   ##### #  #  # #####   #       #####   #####   
// #       #   #   #       #######    #    #             #     # #       #       #       #       
// #     # #    #  #       #     #    #    #             #     # #       #       #       #       
//  #####  #     # ####### #     #    #    #######       #     # ####### ####### ####### ####### 

exports.run = async() => {

    let tile_size = 32;
    let range = (tile_size * 2)-(tile_size / 2)
    
    list = {
        model: "Melee"
        ,params: [
            {
                name: "none",
                cost: 0,
                damage: 0,
                ap: 0,
                max_targets : 0,
                range: range * 1
            },
            {
                name: "bare-hands",
                cost: 0,
                damage: 1,
                ap: 0,
                max_targets : 1,
                range: range * 1
            },            
            {
                name: "sword",
                cost: 2,
                damage: 1,
                ap: 1,
                max_targets: 1,
                range: range * 1
            },
            {
                name: "claws",
                cost: 9,
                damage: 1,
                ap: 2,
                max_targets: 3,
                range: range * 1
            },
            {
                name: "power fist",
                cost: 16,
                damage: 4,
                ap: 4,
                max_targets : 2,
                range: range * 1
            },            
        ]
    }
    return Promise.all([databaseHandler.createData(list)]);
}