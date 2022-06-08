const models = {};
models.Room = require("./room");
models.User = require("./user");
models.Error = require("./error");

models.Unit = require("./game/unit");
models.Armour = require("./game/armour");
models.Melee = require("./game/melee");
models.Gun = require("./game/gun");

models.Faction = require("./game/faction");
models.Army = require("./game/army");
models.Squad = require("./game/squad");
models.Upgrade = require("./game/upgrade");
models.SpecialRule = require("./game/special_rule");
models.Barrier = require("./game/barrier");

models.DynamicRoute = require("./game/dynamic_route");


module.exports = models