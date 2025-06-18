const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient({});

// Afficher le tableau de bord employé
exports.getDashboard = async (req, res) => {
    try {
        // Récupérer l'employé connecté avec son ordinateur assigné
        const employe = await prisma.employe.findUnique({
            where: {
                id: req.session.employe.id
            },
            include: {
                computer: true,
                tasks: {
                    orderBy: {
                        dueDate: 'asc'
                    }
                }
            }
        });
        
        if (!employe) {
            return res.redirect("/employee/login?error=Employé non trouvé");
        }
        
        // Rendre la vue avec les données
        res.render("pages/employee-dashboard.twig", {
            employe: employe,
            tasks: employe.tasks || [],
            success: req.query.success,
            error: req.query.error ? { message: req.query.error } : null
        });
    } catch (error) {
        console.error("Erreur lors du chargement du tableau de bord employé:", error);
        res.redirect("/employee/login?error=Erreur lors du chargement du tableau de bord");
    }
};

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
    try {
        await prisma.task.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                dueDate: new Date(req.body.dueDate),
                status: req.body.status,
                employeId: parseInt(req.body.employeId)
            }
        });
        
        return res.redirect("/employee/dashboard?success=Tâche ajoutée avec succès");
    } catch (error) {
        console.error("Erreur lors de la création de la tâche:", error);
        return res.redirect("/employee/dashboard?error=Erreur lors de la création de la tâche");
    }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        
        await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                title: req.body.title,
                description: req.body.description,
                dueDate: new Date(req.body.dueDate),
                status: req.body.status
            }
        });
        
        return res.redirect("/employee/dashboard?success=Tâche mise à jour avec succès");
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche:", error);
        return res.redirect("/employee/dashboard?error=Erreur lors de la mise à jour de la tâche");
    }
};

// Mettre à jour le statut d'une tâche
exports.updateTaskStatus = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        
        await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                status: req.body.status
            }
        });
        
        return res.redirect("/employee/dashboard?success=Statut de la tâche mis à jour");
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la tâche:", error);
        return res.redirect("/employee/dashboard?error=Erreur lors de la mise à jour du statut");
    }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        
        await prisma.task.delete({
            where: {
                id: taskId
            }
        });
        
        return res.redirect("/employee/dashboard?success=Tâche supprimée avec succès");
    } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
        return res.redirect("/employee/dashboard?error=Erreur lors de la suppression de la tâche");
    }
};