const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

//INDEX
router.get("/", middleware.user_access, controllers.test.runTest);


module.exports = router;