const express = require("express");
const router = express.Router();

const controllers = require('../controllers');
const middleware = require("../middleware");


router.get("/", controllers.login.getLanding)

router.get("/register", controllers.login.getFormRegisterUser)

router.post("/register", controllers.login.createSelfUser)

router.get("/login", controllers.login.getFormLoginUser)

router.post("/login", controllers.login.loginUser)

router.get("/logout", controllers.login.logoutUser)

router.get("/room", middleware.user_access, controllers.login.getRoom)



module.exports = router;