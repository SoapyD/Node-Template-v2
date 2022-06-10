const classes = require('../classes');

exports.runTest = async(req,res) => {

    const gameMap = new classes.game_maps()
    await gameMap.setup();

}