const classes = require("../classes");


exports.user_access = [require("./access").isLoggedIn]

exports.setup = require("./setup")
global.errorHandler = new classes.error_handler();