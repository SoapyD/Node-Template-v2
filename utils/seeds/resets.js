

exports.resetRooms = async() => {
    let list = [
        {model: "Error"},        
        {model: "Room"}, 
    ]   
    await databaseHandler.removeData(list);   
    console.log("Rooms Reset") 
}

exports.resetTables = async() => {

    
    //REMOVE ALL DATA FOR MODELS WE WANT TO RESET
    let list = [
    {model: "Error"},
    {model: "Room"},
    {model: "Army"},

    {model: "DynamicRoute"},    
    {model: "Faction"},
    {model: "Squad"} ,
    {model: "Upgrade"},
    {model: "SpecialRule"}, 
    {model: "Barrier"},    
    {model: "Effect"},          

    {model: "Unit"},
    {model: "Gun"},
    {model: "Melee"},
    {model: "Armour"},  
    ]

    await databaseHandler.removeData(list);
}