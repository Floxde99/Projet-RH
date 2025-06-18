const express = require('express');
const router = express.Router();
const employeeDashboardController = require('../controllers/EmployeeDashboardController');
const employeeAuthguard = require('../../services/employeeAuthguard');

// Routes du tableau de bord employé (protégées par employeeAuthguard)
router.get("/employee/dashboard", employeeAuthguard, employeeDashboardController.getDashboard);
router.post("/employee/task/create", employeeAuthguard, employeeDashboardController.createTask);
router.post("/employee/task/update/:id", employeeAuthguard, employeeDashboardController.updateTask);
router.post("/employee/task/update-status/:id", employeeAuthguard, employeeDashboardController.updateTaskStatus);
router.get("/employee/task/delete/:id", employeeAuthguard, employeeDashboardController.deleteTask);

module.exports = router;