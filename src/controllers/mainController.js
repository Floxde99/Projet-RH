const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient({});

exports.getMain = async (req, res) => {
    try {
        // Récupérer tous les employés avec leurs ordinateurs
        const employes = await prisma.employe.findMany({
            include: {
                computer: true,
                tasks: {
                    orderBy: {
                        dueDate: 'asc'
                    }
                }
            }
        });
        
        // Récupérer tous les ordinateurs avec leurs employés assignés
        const computers = await prisma.computer.findMany({
            include: {
                employe: true
            }
        });
        
        // Récupérer toutes les tâches avec les informations des employés
        const tasks = await prisma.task.findMany({
            include: {
                employe: true
            },
            orderBy: {
                dueDate: 'asc'
            }
        });
        
        // Rendre la vue avec toutes les données
        res.render("pages/main.twig", {
            employes: employes,
            computers: computers,
            tasks: tasks,
            success: req.query.success,
            error: req.query.error ? { message: req.query.error } : null
        });
    } catch (error) {
        console.error("Erreur lors du chargement de la page principale:", error);
        res.render("pages/main.twig", {
            employes: [],
            computers: [],
            tasks: [],
            error: { message: "Erreur lors du chargement des données" }
        });
    }
};