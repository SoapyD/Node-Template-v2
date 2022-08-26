
module.exports = async(options) => {

    return databaseHandler.findData({
        model: options.mode
        ,search_type: "findOne"
        ,params: options.params
    })         

}