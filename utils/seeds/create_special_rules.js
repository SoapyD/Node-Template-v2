

    //  #####  ######  #######    #    ####### #######        #####  ######  #######  #####  ###    #    #             ######  #     # #       #######  #####  
    // #     # #     # #         # #      #    #             #     # #     # #       #     #  #    # #   #             #     # #     # #       #       #     # 
    // #       #     # #        #   #     #    #             #       #     # #       #        #   #   #  #             #     # #     # #       #       #       
    // #       ######  #####   #     #    #    #####   #####  #####  ######  #####   #        #  #     # #       ##### ######  #     # #       #####    #####  
    // #       #   #   #       #######    #    #                   # #       #       #        #  ####### #             #   #   #     # #       #             # 
    // #     # #    #  #       #     #    #    #             #     # #       #       #     #  #  #     # #             #    #  #     # #       #       #     # 
    //  #####  #     # ####### #     #    #    #######        #####  #       #######  #####  ### #     # #######       #     #  #####  ####### #######  #####  


    exports.run = async() => {

        list = {
            model: "SpecialRule"
            ,params: [
               { //done
                    name: "swift",
                    description:"unit can charge even if they've shot their weapon",
                },
                { //done
                    name: "sword dance",
                    description:"unit can leave combat without suffering opportunity attacks from enemies",
                }, 
                { //done
                    name: "firing drills",
                    description:"unit that doesn't move can double the number of shots from their ranged weapon",
                }, 
                { //done
                    name: "whirling dervish",
                    description:"unit adds 4 to their melee armour piercing value the turn they move into combat",
                },
                { //done
                    name: "sniper",
                    description:"unit adds 4 to their armour piercing value if they don't move before taking the shot",
                },       
                { //done
                    name: "berserker",
                    description:"unit can double the number of targets from their melee weapon the turn they move into combat",
                },    
                { //done
                    name: "regen",
                    description:"20% chance of the unit regenerating any lost wounds suffered",
                },  
                { //done
                    name: "barrage",
                    description:"you may fire a shot with a weapon indirectly",
                },                                      
                
            ]
        }
    
        return Promise.all([databaseHandler.createData(list)]); 
    }