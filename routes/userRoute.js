const express = require('express');
const userController = require('../controller/userController.js');
const userAuth = require('../middlewares/userAuth.js');
const router = express.Router();


router.get('/', userController.loginget);
router.get('/signup',userAuth,userController.signupget);
router.post('/signup',userController.signupVerify);
router.post('/login',userController.loginVerify);
router.post('/logout',userController.userLogout);

module.exports = router;