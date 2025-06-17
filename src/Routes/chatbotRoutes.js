const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/ChatbotController');
const authguard = require('../../services/authguard');

// Routes pour le chatbot (protégées par authguard)
router.get("/chatbot", authguard, chatbotController.getChatbot);
router.post("/chatbot/message", authguard, express.json(), chatbotController.sendMessage);
router.get("/chatbot/clear", authguard, chatbotController.clearChat);

module.exports = router;