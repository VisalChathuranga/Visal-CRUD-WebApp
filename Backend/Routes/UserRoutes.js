const express = require('express');
const router = express.Router();
//Insert Model
const UserModel = require('../Model/UserModel');
//Insert User Controller
const userController = require('../Controllers/UserControllers');

router.get("/", userController.getAllUsers);
router.post("/", userController.addUsers);
router.get("/:id", userController.getById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

//export
module.exports = router;