const express = require('express');
const router = express.Router();
const RHController = require('../controllers/RHController');
const authguard = require('../../services/authguard');



router.get("/login", RHController.getlogin);
router.post("/login", RHController.postLogin);
router.get("/register", RHController.getRegister);
router.post("/register", RHController.postRegister);
router.get("/logout", RHController.logout);






module.exports = router;