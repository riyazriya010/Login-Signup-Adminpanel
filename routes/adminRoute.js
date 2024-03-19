const express = require("express");
const adminController = require("../controller/adminController.js");
const adminAuth = require('../middlewares/adminAuth.js');
const router = express.Router();

router.get("/adminLogin", adminController.adminget);
router.post("/adminLogin", adminController.adminVerify);
router.post("/adminLogout", adminController.adminLogout);
router.post("/adminAdd", adminController.addUser);
router.delete("/userDelete/:id", adminController.userDelete);
router.post("/adminSearch", adminController.userSearch);
router.get('/adminEdit/:id',adminAuth,adminController.editUser)
router.put("/updateUser/:id",adminController.updateUser);


module.exports = router;
