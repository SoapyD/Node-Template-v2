
    //  #####  ######  #######    #    ####### #######       #     # ######   #####  ######     #    ######  #######  #####  
    // #     # #     # #         # #      #    #             #     # #     # #     # #     #   # #   #     # #       #     # 
    // #       #     # #        #   #     #    #             #     # #     # #       #     #  #   #  #     # #       #       
    // #       ######  #####   #     #    #    #####   ##### #     # ######  #  #### ######  #     # #     # #####    #####  
    // #       #   #   #       #######    #    #             #     # #       #     # #   #   ####### #     # #             # 
    // #     # #    #  #       #     #    #    #             #     # #       #     # #    #  #     # #     # #       #     # 
    //  #####  #     # ####### #     #    #    #######        #####  #        #####  #     # #     # ######  #######  #####  

    exports.run = async() => {

        await exports.heavy_weapons();
        await exports.melee_weapons();
        await exports.squad_leaders();


        /*
        return_data = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "shield generator"}
        })    
        unit_data = await databaseHandler.findData({
            model: "Unit"
            ,search_type: "findOne"
            ,params: {name: "special"}
        })      
    
        cost = return_data[0].cost + unit_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "shield generator",
                    description:"outfit one trooper with a shield generator",
                    cost: return_data[0].cost,
                    unit: unit_data[0]._id,
                    gun: return_data[0]._id,
                },
            ]
        }
        await databaseHandler.createData(list);     
    
    
    
        return_data = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "plasma"}
        })    
        unit_data = await databaseHandler.findData({
            model: "Unit"
            ,search_type: "findOne"
            ,params: {name: "special"}
        })      
    
        cost = return_data[0].cost + unit_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "special weapon",
                    description:"outfit one trooper with a plasma weapon",
                    cost: return_data[0].cost,
                    unit: unit_data[0]._id,
                    gun: return_data[0]._id,
                    // melee: melee[0]._id,
                    // armour: armour[0]._id,
                },
            ]
        }
        
        */

        
        return Promise.all([databaseHandler.createData(list)]); 
    }

    // #     # #######    #    #     # #     #       #     # #######    #    ######  ####### #     #  #####  
    // #     # #         # #   #     #  #   #        #  #  # #         # #   #     # #     # ##    # #     # 
    // #     # #        #   #  #     #   # #         #  #  # #        #   #  #     # #     # # #   # #       
    // ####### #####   #     # #     #    #    ##### #  #  # #####   #     # ######  #     # #  #  #  #####  
    // #     # #       #######  #   #     #          #  #  # #       ####### #       #     # #   # #       # 
    // #     # #       #     #   # #      #          #  #  # #       #     # #       #     # #    ## #     # 
    // #     # ####### #     #    #       #           ## ##  ####### #     # #       ####### #     #  ##### 

    exports.heavy_weapons = async() => {
        let return_data;
        let cost;

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////

        return_data = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "rocket launcher"}
        })    
    
        cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "trooper rocket launcher",
                    description:"outfit one trooper with a rocket launcher",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "trooper_rocket"
                },
            ]
        }
        await databaseHandler.createData(list);   
    
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////

        return_data = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "laser cannon"}
        })    
    
        cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "trooper laser cannon",
                    description:"outfit one trooper with a laser cannon",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "trooper_laser_cannon"
                },
            ]
        }
        await databaseHandler.createData(list);
        
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////                

        return_data = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "assault cannon"}
        })    
    
        cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "trooper assault cannon",
                    description:"outfit one trooper with a assault cannon",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "trooper_assault_cannon"
                },
                {
                    name: "elite assault cannon",
                    description:"outfit one elite with a assault cannon",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "elite_assault_cannon"
                },                
            ]
        }
        await databaseHandler.createData(list);

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////                

        return_data = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "rad cannon"}
        })    
    
        cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "trooper rad cannon",
                    description:"outfit one trooper with a rad cannon",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "trooper_rad_cannon"
                },
            ]
        }
        await databaseHandler.createData(list);


        // return Promise.all([databaseHandler.createData(list)]);
    }

    // #     # ####### #       ####### #######       #     # #######    #    ######  ####### #     #  #####  
    // ##   ## #       #       #       #             #  #  # #         # #   #     # #     # ##    # #     # 
    // # # # # #       #       #       #             #  #  # #        #   #  #     # #     # # #   # #       
    // #  #  # #####   #       #####   #####   ##### #  #  # #####   #     # ######  #     # #  #  #  #####  
    // #     # #       #       #       #             #  #  # #       ####### #       #     # #   # #       # 
    // #     # #       #       #       #             #  #  # #       #     # #       #     # #    ## #     # 
    // #     # ####### ####### ####### #######        ## ##  ####### #     # #       ####### #     #  #####  


    exports.melee_weapons = async() => {
        let melee;
        let gun;
        let cost;

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////

        melee = await databaseHandler.findData({
            model: "Melee"
            ,search_type: "findOne"
            ,params: {name: "claws"}
        })  
        gun = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "none"}
        })            
    
        cost = melee[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "elite claws",
                    description:"outfit all elite troopers with claws",
                    cost: cost,
                    melee: melee[0]._id,
                    gun: gun[0]._id,                    
                    spritesheet: "elite_claws",
                    upgrades_all_in_squad: true
                },
            ]
        }
        await databaseHandler.createData(list);  
        
        
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "assault claws",
                    description:"outfit all assault troopers with claws",
                    cost: cost,
                    melee: melee[0]._id,
                    gun: gun[0]._id,                    
                    spritesheet: "assault_claws",
                    upgrades_all_in_squad: true
                },
            ]
        }
        await databaseHandler.createData(list);          
    }


    //  #####   #####  #     #    #    ######        #       #######    #    ######  ####### ######   #####  
    // #     # #     # #     #   # #   #     #       #       #         # #   #     # #       #     # #     # 
    // #       #     # #     #  #   #  #     #       #       #        #   #  #     # #       #     # #       
    //  #####  #     # #     # #     # #     # ##### #       #####   #     # #     # #####   ######   #####  
    //       # #   # # #     # ####### #     #       #       #       ####### #     # #       #   #         # 
    // #     # #    #  #     # #     # #     #       #       #       #     # #     # #       #    #  #     # 
    //  #####   #### #  #####  #     # ######        ####### ####### #     # ######  ####### #     #  #####    


    exports.squad_leaders = async() => {
        let return_data;
        let cost;

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////

        let melee = await databaseHandler.findData({
            model: "Melee"
            ,search_type: "findOne"
            ,params: {name: "sword"}
        })    
        let gun = await databaseHandler.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "pistol"}
        })            
    
        cost = melee[0].cost + gun[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "trooper squad leader",
                    description:"outfit one trooper as a squad leader",
                    cost: cost,
                    gun: gun[0]._id,
                    melee: melee[0]._id,
                    spritesheet: "trooper_leader"
                },
            ]
        }
        await databaseHandler.createData(list);   

        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "elite squad leader",
                    description:"outfit one elite as a squad leader",
                    cost: cost,
                    gun: gun[0]._id,
                    melee: melee[0]._id,    
                    spritesheet: "elite_leader"
                },
            ]
        }
        await databaseHandler.createData(list);   

        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "assault squad leader",
                    description:"outfit one assault as a squad leader",
                    cost: cost,
                    gun: gun[0]._id,
                    melee: melee[0]._id,                    
                    spritesheet: "assault_leader"
                },
            ]
        }
        await databaseHandler.createData(list);   


    }
