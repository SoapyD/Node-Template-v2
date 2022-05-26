// const models = require("../models");
// const queries = require("./queries");


exports.resetRooms = async() => {
    let list = [
        {model: "Room"}, 
    ]   
    await queries.removeData(list);   
    console.log("Rooms Reset") 
}

exports.seedDB = async() => {

    
    //REMOVE ALL DATA FOR MODELS WE WANT TO RESET
    let list = [
    {model: "Country"}, 
    {model: "Score"},     
    ]
    await database_handler.removeData(list);

    await exports.createCountries();    
    console.log("Seeding Complete")

}

exports.createCountries = async() => {

    list = {
        model: 'Country'
        ,params:
    [
        {
            name: "Czech Republic",
            order: 1
        },
        {
            name: "Romania",
            order: 2
        },
        {
            name: "Portugal",
            order: 3
        },
        {
            name: "Finland",
            order: 4
        },
        {
            name: "Switzerland",
            order: 5
        },
        {
            name: "France",
            order: 6
        },
        {
            name: "Norway",
            order: 7
        },
        {
            name: "Armenia",
            order: 8
        },
        {
            name: "Italy",
            order: 9
        },
        {
            name: "Spain",
            order: 10
        },
        {
            name: "Netherlands",
            order: 11
        },
        {
            name: "Ukraine",
            order: 12
        },
        {
            name: "Germany",
            order: 13
        },
        {
            name: "Lithuania",
            order: 14
        },
        {
            name: "Azerbaijan",
            order: 15
        },
        {
            name: "Belgium",
            order: 16
        },
        {
            name: "Greece",
            order: 17
        },
        {
            name: "Iceland",
            order: 18
        },
        {
            name: "Moldova",
            order: 19
        },
        {
            name: "Sweden",
            order: 20
        },
        {
            name: "Australia",
            order: 21
        },
        {
            name: "United Kingdom",
            order: 22
        },
        {
            name: "Poland",
            order: 23
        },
        {
            name: "Serbia",
            order: 24
        },
        {
            name: "Estonia",
            order: 25
        }                  
        ]
    }
    return Promise.all([database_handler.createData(list)]);
}

