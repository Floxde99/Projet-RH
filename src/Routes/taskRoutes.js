const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TaskController');
const authguard = require('../../services/authguard');

// Routes pour les tâches (protégées)
router.post("/task/create", authguard, taskController.createTask);
router.post("/task/update/:id", authguard, taskController.updateTask); // Nouvelle route
router.post("/task/update-status/:id", authguard, taskController.updateTaskStatus);
router.get("/task/delete/:id", authguard, taskController.deleteTask);

module.exports = router;