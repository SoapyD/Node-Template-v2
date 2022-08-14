const seeds = require("./seeds");

exports.resetRooms = async() => {
    let list = [
        {model: "Room"}, 
        {model: "GameData"},         
    ]   
    await databaseHandler.removeData(list);   
    console.log("Rooms Reset") 
}


exports.run = async() => {

    await seeds.reset.resetTables();

    await seeds.create_routes.run();

    await seeds.create_units.run();
    await seeds.create_effects.run();        
    await seeds.create_barriers.run();
    await seeds.create_guns.run();
    await seeds.create_melees.run();
    await seeds.create_armour.run();
    await seeds.create_upgrades.run();  
    await seeds.create_special_rules.run();    
    
    await seeds.create_squads.run()
    await seeds.create_factions.run()

    
    console.log("Seeding Complete")
}