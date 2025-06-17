const axios = require('axios');
require('dotenv').config();

// Configuration pour l'API Mistral
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY; // Ajoutez cette clé dans votre fichier .env

exports.getChatbot = async (req, res) => {
  try {
    res.render("pages/chatbot.twig", {
      user: req.session.user,
      messages: req.session.chatMessages || []
    });
  } catch (error) {
    console.error("Erreur lors du chargement du chatbot:", error);
    res.redirect("/?error=Erreur lors du chargement du chatbot");
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    if (!req.session.chatMessages) {
      req.session.chatMessages = [];
    }
    
    // Ajouter le message de l'utilisateur à l'historique
    req.session.chatMessages.push({
      role: 'user',
      content: userMessage
    });
    
    // Préparer les messages pour l'API Mistral
    const messages = [
      { 
        role: 'system', 
        content: 'Vous êtes un assistant RH utile qui aide les utilisateurs à gérer leurs employés et ordinateurs. Répondez de manière concise et professionnelle.'
      },
      ...req.session.chatMessages
    ];
    
    // Envoyer la demande à l'API Mistral
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-small", // ou un autre modèle Mistral disponible
        messages: messages,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        }
      }
    );
    
    // Récupérer la réponse
    const assistantResponse = response.data.choices[0].message.content;
    
    // Ajouter la réponse de l'assistant à l'historique
    req.session.chatMessages.push({
      role: 'assistant',
      content: assistantResponse
    });
    
    // Limiter la taille de l'historique (pour éviter que la session ne devienne trop grande)
    if (req.session.chatMessages.length > 10) {
      req.session.chatMessages = req.session.chatMessages.slice(-10);
    }
    
    // Renvoyer les messages mis à jour
    return res.json({
      success: true,
      messages: req.session.chatMessages
    });
  } catch (error) {
    console.error("Erreur détaillée:", error.response?.data || error.message, error.stack);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'envoi du message: " + (error.response?.data?.error?.message || error.message)
    });
  }
};

exports.clearChat = async (req, res) => {
  req.session.chatMessages = [];
  return res.redirect("/chatbot");
};