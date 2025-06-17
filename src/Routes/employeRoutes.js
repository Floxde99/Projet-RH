const express = require('express');
const router = express.Router();
const employeController = require('../controllers/EmployeController');
const authguard = require('../../services/authguard');

// Routes pour les employés (toutes protégées par authguard)
router.post("/employe/create", authguard, employeController.createEmploye);
router.post("/employe/update/:id", authguard, employeController.updateEmploye);
router.get("/employe/delete/:id", authguard, employeController.deleteEmploye);

module.exports = router;