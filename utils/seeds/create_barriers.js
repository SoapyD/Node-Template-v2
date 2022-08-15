
    //  #####  ######  #######    #    ####### #######       ######     #    ######  ######  ### ####### ######   #####  
    // #     # #     # #         # #      #    #             #     #   # #   #     # #     #  #  #       #     # #     # 
    // #       #     # #        #   #     #    #             #     #  #   #  #     # #     #  #  #       #     # #       
    // #       ######  #####   #     #    #    #####   ##### ######  #     # ######  ######   #  #####   ######   #####  
    // #       #   #   #       #######    #    #             #     # ####### #   #   #   #    #  #       #   #         # 
    // #     # #    #  #       #     #    #    #             #     # #     # #    #  #    #   #  #       #    #  #     # 
    //  #####  #     # ####### #     #    #    #######       ######  #     # #     # #     # ### ####### #     #  #####  

    exports.run = async() => {

        let p_effects = await databaseHandler.findData({
            model: "Effect"
            ,search_type: "findOne"
            ,params: {name: 'poison'}
        })   
        let b_effects = await databaseHandler.findData({
            model: "Effect"
            ,search_type: "findOne"
            ,params: {name: 'blunt'}
        })           

        list = {
            model: "Barrier"
            ,params: [
               {
                    name: "poison",
                    description:"poison any unit that passes through the cloud",
                    blast_radius: 3,
                    blast_sprite: "smoke",
                    // effects: ["poison"],
                    effects: [p_effects[0].id],
                    // modifier: 20 - ((20 /100) * 20), //TOTAL 20% CHANCE OF POISON HITTING
                    life: 3
                },
                {
                    name: "blunt",
                    description:"blunt the effectiveness of any projectile that passes through the barrier",
                    blast_radius: 3,
                    blast_sprite: "barrier",
                    // effects: ["blunt"],
                    effects: [b_effects[0].id],                    
                    // modifier: 20 - ((20 /100) * 20), //TOTAL 20% EFFECT on AP      
                    life: 3                    
                },            
            ]
        }
    
        return Promise.all([databaseHandler.createData(list)]); 
    }