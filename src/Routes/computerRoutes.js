const express = require('express');
const router = express.Router();
const computerController = require('../controllers/ComputerController');
const authguard = require('../../services/authguard');

// Routes pour les ordinateurs (toutes protégées par authguard)
router.post("/computer/create", authguard, computerController.createComputer);
router.post("/computer/update/:id", authguard, computerController.updateComputer);
router.get("/computer/delete/:id", authguard, computerController.deleteComputer);
router.post("/computer/assign/:id", authguard, computerController.assignComputer);
router.get("/computer/unassign/:id", authguard, computerController.unassignComputer);

module.exports = router;