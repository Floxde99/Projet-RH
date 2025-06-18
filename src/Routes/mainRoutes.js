const express = require('express');
const router = express.Router();
const authguard = require('../../services/authguard');
const mainController = require('../controllers/mainController');

router.get("/", authguard, mainController.getMain);


module.exports = router;