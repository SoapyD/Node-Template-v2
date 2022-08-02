const mongoose_db_handler = class {
	constructor(options) {	

        this.models = require("../models");
        this.connect()
    }

    connect = () => {

        const mongoose = require("mongoose");

        try{
            //setup mongoose connection
            mongoose.connect("mongodb+srv://admin:"+process.env.DB_PASS+"@cluster0.cvy6a.azure.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority", 
            { 
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                retryWrites: true
            }
            ).then(() => {
                console.log('Connected to DB!');
            }).catch(err => {
                console.log("Error:", err.message);
            })  //will create cat app is it doesn't already exist
        }catch(e){
            console.log("CAN'T CONNECT TO DATABASE")
            console.log(e.d)
        }
    }

    getPopulateLists = (type) => {
        let populate_list = [];

        switch(type){
            case 'Room':
                // populate_list.push({path: 'admins',model: "User"})  
                populate_list.push({
                    path: "users",
                    populate: [
                        {path: 'user'}
                    ]
                })  
                break;

            case 'GameData': 
                           
                populate_list.push(
                    {
                    path: "forces",                 
                    populate: 
                    [
                        {path: 'user'},
                        {
                            path: 'army',
                            populate: {
                                path: "squads",
                                populate: [
                                {
                                    path: "squad",
                                    populate: [
                                            {path: 'unit'},  
                                            {
                                                path: 'gun'
                                                ,populate: {path: "barrier", model: "Barrier"}
                                            },
                                            {path: 'melee'},
                                            {path: 'armour'},
                                            {
                                                path: 'upgrades',
                                                populate: [
                                                    {path: "upgrade"},
                                                    {path: 'unit'},  
                                                    {path: 'gun'},
                                                    {path: 'melee'},
                                                    {path: 'armour'},
                                                    ]                 
                                            }
                                        ]
                                },
                                {
                                    path: 'upgrades',
                                    populate: {
                                        path: "upgrade",
                                        populate: [
                                            {path: 'unit'},  
                                            {path: 'gun'},
                                            {path: 'melee'},
                                            {path: 'armour'},
                                        ]                    
                                    }          
                                }]                                
                            }
                        },
                    ], 
                })  

                populate_list.push({
                    path: "barriers",                 
                    populate: [
                        {path: 'barrier_class', model:'Barrier'}, 
                    ]
                })

                populate_list.push({
                    path: "units",                 
                    populate: [
                        {path: 'unit_class', model:'Unit'},  
                        {
                            path: 'gun_class', model:'Gun'
                            ,populate: {path: "barrier", model: "Barrier"}
                        },
                        {path: 'melee_class', model:'Melee'},
                        {path: 'armour_class', model:'Armour'},
                    ]                     
                })
                
                break;

            case 'Faction':
                populate_list.push({
                    path: "squads",
                    model: "Squad",
                    populate: [
                        {path: 'upgrades',model: "Upgrade"},
                        {path: 'unit'},
                        {path: 'gun'},
                        {path: 'melee'},
                        {path: 'armour'},
                    ]          
                })
                break;
            case "Army":
                populate_list.push({
                    path: "squads",
                    populate: [
                    {
                        path: "squad",
                        populate: [
                                {path: 'unit'},  
                                {path: 'gun'},
                                {path: 'melee'},
                                {path: 'armour'},
                                {
                                    path: 'upgrades',
                                    populate: [
                                        {path: "upgrade"},
                                        {path: 'unit'},  
                                        {path: 'gun'},
                                        {path: 'melee'},
                                        {path: 'armour'},
                                        ]                 
                                }
                            ]
                    },
                    {
                        path: 'upgrades',
                        populate: {
                            path: "upgrade",
                            populate: [
                                {path: 'unit'},  
                                {path: 'gun'},
                                {path: 'melee'},
                                {path: 'armour'},
                            ]                    
                        }          
                    }
                    ]
                })
                break;
            case 'Squad':
                populate_list.push({path: "unit"})
                populate_list.push({path: "gun"})
                populate_list.push({path: "melee"})
                populate_list.push({path: "armour"}) 
                populate_list.push({path: 'upgrades',model: "Upgrade"}) 
                populate_list.push({path: 'special_rules',model: "SpecialRule"})                                   
                break;
    
            case 'Gun':
                populate_list.push({path: "barrier"})
                break;   
    
            case 'Upgrade':
                populate_list.push({path: "unit"})
                populate_list.push({path: "gun"})                              
                break;       



        }

        return populate_list;
    }

    // ####### ### #     # ######        ######     #    #######    #    
    // #        #  ##    # #     #       #     #   # #      #      # #   
    // #        #  # #   # #     #       #     #  #   #     #     #   #  
    // #####    #  #  #  # #     # ##### #     # #     #    #    #     # 
    // #        #  #   # # #     #       #     # #######    #    ####### 
    // #        #  #    ## #     #       #     # #     #    #    #     # 
    // #       ### #     # ######        ######  #     #    #    #     # 

    findData = async(options, populate=true) => {

        let promises = [];


        let populate_list = [];
        if(populate === true){
            populate_list = this.getPopulateLists(options.model)
        }

        if (options.multiple_search)
        {
            options.multiple_search.forEach((item) => {

                let model = options.model
                if(item.model){
                    model = item.model
                    if(populate === true){
                        populate_list = this.getPopulateLists(model)
                    }
                }

                promises.push(this.models[model][options.search_type](item.params).sort().populate(populate_list))
            })
        }
        else{

            promises.push(this.models[options.model][options.search_type](options.params).sort(options.sort).populate(populate_list))
        }

        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })    
    }

    //  #####  ######  #######    #    ####### #######       ######  #######  #####  ####### ######  ######  
    // #     # #     # #         # #      #    #             #     # #       #     # #     # #     # #     # 
    // #       #     # #        #   #     #    #             #     # #       #       #     # #     # #     # 
    // #       ######  #####   #     #    #    #####   ##### ######  #####   #       #     # ######  #     # 
    // #       #   #   #       #######    #    #             #   #   #       #       #     # #   #   #     # 
    // #     # #    #  #       #     #    #    #             #    #  #       #     # #     # #    #  #     # 
    //  #####  #     # ####### #     #    #    #######       #     # #######  #####  ####### #     # ######  

    createData = async(options, search_type="create") => {

        let promises = [];
        let populate_list = [];
        populate_list = this.getPopulateLists(options.model)        

        options.params.forEach((item) => {
            promises.push(this.models[options.model][search_type](item))
        })

        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })  
    }


// #     # ######  ######     #    ####### #######       ######     #    #######    #    
// #     # #     # #     #   # #      #    #             #     #   # #      #      # #   
// #     # #     # #     #  #   #     #    #             #     #  #   #     #     #   #  
// #     # ######  #     # #     #    #    #####   ##### #     # #     #    #    #     # 
// #     # #       #     # #######    #    #             #     # #######    #    ####### 
// #     # #       #     # #     #    #    #             #     # #     #    #    #     # 
//  #####  #       ######  #     #    #    #######       ######  #     #    #    #     # 

    updateData = async(item, list) => {

        let promises = [];

        if(list)
        {
            list.params.forEach((param_item) => {
                for(const key in param_item){
                    item[key] = param_item[key]
                }
            })
            promises.push(item.save())
        // })  
        }
        else{
            promises.push(item.save())
        }
        
        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    }
    
    updateOne = async(options) => {
        let promises = [];

        if(options.params){
            options.params.forEach((item) => {
                // promises.push(this.models[options.model].updateOne(item.filter, item.value))
                promises.push(this.models[options.model].findOneAndUpdate(item.filter, item.value, {new: true}))
            })            
        }

        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })         
    }


    // ######  #######  #####  ####### ######  ####### #     #       ######     #    #######    #    
    // #     # #       #     #    #    #     # #     #  #   #        #     #   # #      #      # #   
    // #     # #       #          #    #     # #     #   # #         #     #  #   #     #     #   #  
    // #     # #####    #####     #    ######  #     #    #    ##### #     # #     #    #    #     # 
    // #     # #             #    #    #   #   #     #    #          #     # #######    #    ####### 
    // #     # #       #     #    #    #    #  #     #    #          #     # #     #    #    #     # 
    // ######  #######  #####     #    #     # #######    #          ######  #     #    #    #     # 

    destroyData = async(list) => {

        let promises = [];

        // destroy_list.forEach((list) => {
            list.params.forEach((item) => {
                promises.push(this.models[list.model].deleteOne(item))
            })
        // })  

        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    }




    // ######  ####### #     # ####### #     # #######       ######     #    #######    #    
    // #     # #       ##   ## #     # #     # #             #     #   # #      #      # #   
    // #     # #       # # # # #     # #     # #             #     #  #   #     #     #   #  
    // ######  #####   #  #  # #     # #     # #####   ##### #     # #     #    #    #     # 
    // #   #   #       #     # #     #  #   #  #             #     # #######    #    ####### 
    // #    #  #       #     # #     #   # #   #             #     # #     #    #    #     # 
    // #     # ####### #     # #######    #    #######       ######  #     #    #    #     # 
                                                                                        

    removeData = async(list) => {

        let promises = [];

            list.forEach((item) => {
                promises.push(this.models[item.model].remove({}))
            })

        return Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })      
    }

}


module.exports = mongoose_db_handler