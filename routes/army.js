const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

// const User = require("../models/user");


//INDEX - display all
router.get("/", middleware.user_access, controllers.army.getAll)

//CREATE - create new
router.post("/", middleware.user_access, controllers.army.create)

//NEW - show form to create new
router.get("/new", middleware.user_access, controllers.army.getFormCreate)

//SHOW - show details
router.get("/:id", middleware.user_access, controllers.army.getSingle)

//EDIT PRODUCT
router.get("/:id/edit", middleware.user_access, controllers.army.getEdit)

//UPDATE PRODUCT
router.put("/:id", middleware.user_access, controllers.army.update)

//DESTOY
router.delete("/:id", middleware.user_access, controllers.army.delete)


module.exports = router;