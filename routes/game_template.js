const express = require("express");
const router = express.Router();

const controllers = require('../controllers');
const middleware = require("../middleware");


router.get("/", middleware.user_access, controllers.game_template.getGameRoom)



module.exports = router;