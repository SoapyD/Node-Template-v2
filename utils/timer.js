
exports.checkTimer = async() => {
    // try{
    //     exports.checkItems("Room", 2)
    //     exports.checkItems("Error", 48)        
    // }    
    // catch(err){
    //     console.log("ERROR TRYING TO RUN TIMER")
    //     console.log(err)     
    // }

    setTimeout(exports.checkTimer, process.env.TIMER_MS);
}


exports.checkItems = async(model, hours) => {

    try{
        var cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - hours);
    
        let data = await databaseHandler.findData({
            model: model
            ,search_type: "find"
            ,params: 
                {
                    updateddate: {
                        $lt: cutoff
                    }
                }
            
        })
    
    
        if(data){
            if(data[0]){
        
                let ids = [];
                data[0].forEach((item) => {
                    ids.push({_id: item._id})
                })
        
                if(ids.length > 0){
                    let item = await databaseHandler.destroyData({
                        model: model
                        ,params: ids
                    })
                }
            }
        }
    }catch(e){
        console.log("Error running timer!")
        console.log(e)
    }

}