

    //  #####  ######  #######    #    ####### #######       #     # #     # ### #######  #####  
    // #     # #     # #         # #      #    #             #     # ##    #  #     #    #     # 
    // #       #     # #        #   #     #    #             #     # # #   #  #     #    #       
    // #       ######  #####   #     #    #    #####   ##### #     # #  #  #  #     #     #####  
    // #       #   #   #       #######    #    #             #     # #   # #  #     #          # 
    // #     # #    #  #       #     #    #    #             #     # #    ##  #     #    #     # 
    //  #####  #     # ####### #     #    #    #######        #####  #     # ###    #     #####  

    //  #####  ######  #######    #    ####### #######        #####  #     #    #    #       #       
    // #     # #     # #         # #      #    #             #     # ##   ##   # #   #       #       
    // #       #     # #        #   #     #    #             #       # # # #  #   #  #       #       
    // #       ######  #####   #     #    #    #####   #####  #####  #  #  # #     # #       #       
    // #       #   #   #       #######    #    #                   # #     # ####### #       #       
    // #     # #    #  #       #     #    #    #             #     # #     # #     # #       #       
    //  #####  #     # ####### #     #    #    #######        #####  #     # #     # ####### ####### 

    exports.run = async() => {

        list = {
            model: "Unit"
            ,params: [
               {
                    name: 'general',
                    cost: 108,
                    shooting_bonus: 4,
                    fighting_bonus: 4,
                    health: 4,
                    movement: 8,
                    cohesion: 50,
    
                    size: 0,
                    sprite_offset: 0.5,
                    spritesheet: 'trooper_leader',
                    death_sfx: "death_man", 
                    symbol_id: 5,
                },
                {
                    name: 'trooper',
                    cost: 8,
                    shooting_bonus: 0,
                    fighting_bonus: 0,
                    health: 2,
                    movement: 6,
                    cohesion: 75,
    
                    size: 0,
                    sprite_offset: 0.5,
                    spritesheet: 'trooper_blaster',
                    death_sfx: "death_man",
                    symbol_id: 3,                
                },
                // {
                //     name: 'recon',
                //     cost: 27,
                //     shooting_bonus: 2,
                //     fighting_bonus: 0,
                //     health: 1,
                //     movement: 8,
                //     cohesion: 150,
    
                //     size: 0,
                //     sprite_offset: 0.5,
                //     spritesheet: 'trooper_blaster',
                //     death_sfx: "death_man",
                //     symbol_id: 3,                
                // },
                {
                    name: 'elite',
                    cost: 45,
                    shooting_bonus: 2,
                    fighting_bonus: 2,
                    health: 3,
                    movement: 6,
                    cohesion: 75,
    
                    size: 0,
                    sprite_offset: 0.5,
                    spritesheet: 'elite_blaster',
                    death_sfx: "death_man",
                    symbol_id: 3,                
                },

                {
                    name: 'heavy',
                    cost: 8,
                    shooting_bonus: 0,
                    fighting_bonus: 0,
                    health: 2,
                    movement: 6,
                    cohesion: 75,
                    
                    size: 0,
                    sprite_offset: 0.5,
                    spritesheet: 'heavy',
                    death_sfx: "death_man",
                    symbol_id: 7,
                },
            
    
                //  #####  ######  #######    #    ####### #######       #     # ####### ######  ### #     # #     # 
                // #     # #     # #         # #      #    #             ##   ## #       #     #  #  #     # ##   ## 
                // #       #     # #        #   #     #    #             # # # # #       #     #  #  #     # # # # # 
                // #       ######  #####   #     #    #    #####   ##### #  #  # #####   #     #  #  #     # #  #  # 
                // #       #   #   #       #######    #    #             #     # #       #     #  #  #     # #     # 
                // #     # #    #  #       #     #    #    #             #     # #       #     #  #  #     # #     # 
                //  #####  #     # ####### #     #    #    #######       #     # ####### ######  ###  #####  #     # 
                                                                                                                  

                {
                    name: 'juggernaut',
                    cost: 60,
                    shooting_bonus: 2,
                    fighting_bonus: 2,
                    health: 4,
                    movement: 6,
                    cohesion: 0,
                    
                    size: 1,
                    sprite_offset: 0,	
                    spritesheet: 'dread_assault_fist',
                    death_sfx: "death_machine",
                    symbol_id: 1,                
                },

                {
                    name: 'biker',
                    cost: 14,
                    shooting_bonus: 0,
                    fighting_bonus: 0,
                    health: 2,
                    movement: 12,
                    cohesion: 150,
                    
                    size: 1,
                    sprite_offset: 0,	
                    spritesheet: 'biker',
                    death_sfx: "death_machine",
                    symbol_id: 1,                
                },

                //  #####  ######  #######    #    ####### #######       #          #    ######   #####  ####### 
                // #     # #     # #         # #      #    #             #         # #   #     # #     # #       
                // #       #     # #        #   #     #    #             #        #   #  #     # #       #       
                // #       ######  #####   #     #    #    #####   ##### #       #     # ######  #  #### #####   
                // #       #   #   #       #######    #    #             #       ####### #   #   #     # #       
                // #     # #    #  #       #     #    #    #             #       #     # #    #  #     # #       
                //  #####  #     # ####### #     #    #    #######       ####### #     # #     #  #####  #######

                {
                    name: 'light tank',
                    cost: 18,
                    shooting_bonus: 0,
                    fighting_bonus: 0,
                    movement: 12,
                    health: 6,
                    cohesion: 0,
                    
                    size: 1,
                    sprite_offset: 0.5,	
                    spritesheet: 'tank_assault',
                    death_sfx: "death_machine",
                    symbol_id: 12,                
                },     

                {
                    name: 'tank',
                    cost: 16,
                    shooting_bonus: 0,
                    fighting_bonus: 0,
                    movement: 8,
                    health: 8,
                    cohesion: 0,
                    
                    size: 1,
                    sprite_offset: 0.5,	
                    spritesheet: 'tank_normal',
                    death_sfx: "death_machine",
                    symbol_id: 12,                
                },              

                {
                    name: 'heavy tank',
                    cost: 36,
                    shooting_bonus: 0,
                    fighting_bonus: 0,
                    movement: 6,
                    health: 10,
                    cohesion: 0,
                    
                    size: 1,
                    sprite_offset: 0.5,	
                    spritesheet: 'tank_barrage',
                    death_sfx: "death_machine",
                    symbol_id: 12,                
                },               
            ]
        }
        return Promise.all([databaseHandler.createData(list)]);
    
    }