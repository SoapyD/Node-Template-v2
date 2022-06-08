const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

//INDEX
router.get("/", middleware.user_access, controllers.admin.getAll);

//SHOW
router.get("/:item", middleware.user_access, controllers.admin.getSingle)

//EDIT
router.get("/:item/:id/edit", middleware.user_access, controllers.admin.getEdit)

//UPDATE
router.put("/:item/:id", middleware.user_access, controllers.admin.update)


//CREATE
router.post("/:item", middleware.user_access, controllers.admin.create)

//NEW
router.get("/:item/new", middleware.user_access, controllers.admin.getFormCreate)

//DESTOY
router.delete("/:item/:id", middleware.user_access, controllers.admin.delete)


/*


*/

module.exports = router;