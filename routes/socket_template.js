const express = require("express");
const router = express.Router();

const controllers = require('../controllers');
const middleware = require("../middleware");



router.get("/eurovision", middleware.user_access, controllers.socket_template.getEurovision)
router.get("/", middleware.user_access, controllers.socket_template.getSocketRoom)



module.exports = router;