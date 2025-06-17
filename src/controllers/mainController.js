const { PrismaClient } = require("../../generated/prisma");
const employeController = require('./EmployeController');
const computerController = require('./ComputerController');

exports.getHome = async (req, res) => {
    try {
        // Récupérer les employés et ordinateurs
        const employes = await employeController.getAllEmployes(req, res);
        const computers = await computerController.getAllComputers(req, res);
        
        // Passer les données à la vue
        res.render("pages/main.twig", {
            user: req.session.user,
            employes: employes,
            computers: computers,
            success: req.query.success,
            error: req.query.error ? { message: req.query.error } : null
        });
    } catch (error) {
        console.error("Erreur lors du chargement de la page d'accueil:", error);
        res.render("pages/main.twig", {
            user: req.session.user,
            error: { message: "Erreur lors du chargement des données" }
        });
    }
};