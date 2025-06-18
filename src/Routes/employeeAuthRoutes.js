const express = require('express');
const router = express.Router();
const employeeAuthController = require('../controllers/EmployeeAuthController');

// Routes d'authentification pour les employés
router.get("/employee/login", employeeAuthController.getLogin);
router.post("/employee/login", employeeAuthController.postLogin);
router.get("/employee/logout", employeeAuthController.logout);

module.exports = router;