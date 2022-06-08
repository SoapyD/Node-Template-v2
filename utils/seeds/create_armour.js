
    //  #####  ######  #######    #    ####### #######          #    ######  #     # ####### #     # ######  
    // #     # #     # #         # #      #    #               # #   #     # ##   ## #     # #     # #     # 
    // #       #     # #        #   #     #    #              #   #  #     # # # # # #     # #     # #     # 
    // #       ######  #####   #     #    #    #####   ##### #     # ######  #  #  # #     # #     # ######  
    // #       #   #   #       #######    #    #             ####### #   #   #     # #     # #     # #   #   
    // #     # #    #  #       #     #    #    #             #     # #    #  #     # #     # #     # #    #  
    //  #####  #     # ####### #     #    #    #######       #     # #     # #     # #######  #####  #     # 
    exports.run = async() => {
        list = {
            model: "Armour"
            ,params: [
                {
                    name: "none",
                    cost: 0,
                    value: 0,
                },                
                {
                    name: "basic",
                    cost: 4,
                    value: 8,
                },
                {
                    name: "mid-tier",
                    cost: 16,
                    value: 8,
                },     
                {
                    name: "elite",
                    cost: 24,
                    value: 12,
                },                                
                {
                    name: "heavy",
                    cost: 32,
                    value: 16,
                },
            ]
        }
        return Promise.all([databaseHandler.createData(list)]);
    }