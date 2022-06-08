
exports.login = require("./login");
exports.login.path = '/'

exports.admin = require("./admin");
exports.admin.path = '/admin'

exports.army = require("./army");
exports.army.path = '/army'

exports.socket_template = require("./socket_template");
exports.socket_template.path = '/socket_template'

exports.game_template = require("./game_template");
exports.game_template.path = '/game_template'