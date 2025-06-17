const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient({});

// Récupérer tous les ordinateurs
exports.getAllComputers = async (req, res) => {
    try {
        const computers = await prisma.computer.findMany({
            include: {
                employe: true
            }
        });
        
        return computers;
    } catch (error) {
        console.error("Erreur lors de la récupération des ordinateurs:", error);
        return [];
    }
};

// Créer un nouvel ordinateur
exports.createComputer = async (req, res) => {
    try {
        await prisma.computer.create({
            data: {
                macAddress: req.body.macAddress
            }
        });
        
        return res.redirect("/?success=Ordinateur ajouté avec succès");
    } catch (error) {
        console.error("Erreur lors de la création de l'ordinateur:", error);
        
        // Gestion des erreurs de contrainte unique
        if (error.code === "P2002" && error.meta?.target?.includes("macAddress")) {
            return res.redirect("/?error=Cette adresse MAC est déjà utilisée");
        }
        
        return res.redirect("/?error=Erreur lors de la création de l'ordinateur");
    }
};

// Mettre à jour un ordinateur existant
exports.updateComputer = async (req, res) => {
    try {
        const computerId = parseInt(req.params.id);
        
        await prisma.computer.update({
            where: {
                id: computerId
            },
            data: {
                macAddress: req.body.macAddress
            }
        });
        
        return res.redirect("/?success=Ordinateur mis à jour avec succès");
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'ordinateur:", error);
        
        // Gestion des erreurs de contrainte unique
        if (error.code === "P2002" && error.meta?.target?.includes("macAddress")) {
            return res.redirect("/?error=Cette adresse MAC est déjà utilisée");
        }
        
        return res.redirect("/?error=Erreur lors de la mise à jour de l'ordinateur");
    }
};

// Supprimer un ordinateur
exports.deleteComputer = async (req, res) => {
    try {
        const computerId = parseInt(req.params.id);
        
        await prisma.computer.delete({
            where: {
                id: computerId
            }
        });
        
        return res.redirect("/?success=Ordinateur supprimé avec succès");
    } catch (error) {
        console.error("Erreur lors de la suppression de l'ordinateur:", error);
        return res.redirect("/?error=Erreur lors de la suppression de l'ordinateur");
    }
};

// Assigner un employé à un ordinateur
exports.assignComputer = async (req, res) => {
    try {
        const computerId = parseInt(req.params.id);
        const employeId = parseInt(req.body.employeId);
        
        // Vérifier que l'employé n'a pas déjà un ordinateur
        const employe = await prisma.employe.findUnique({
            where: {
                id: employeId
            },
            include: {
                computer: true
            }
        });
        
        if (employe.computer) {
            return res.redirect("/?error=Cet employé a déjà un ordinateur assigné");
        }
        
        // Assigner l'ordinateur à l'employé
        await prisma.computer.update({
            where: {
                id: computerId
            },
            data: {
                employeId: employeId
            }
        });
        
        return res.redirect("/?success=Ordinateur assigné avec succès");
    } catch (error) {
        console.error("Erreur lors de l'assignation de l'ordinateur:", error);
        return res.redirect("/?error=Erreur lors de l'assignation de l'ordinateur");
    }
};

// Désassigner un employé d'un ordinateur
exports.unassignComputer = async (req, res) => {
    try {
        const computerId = parseInt(req.params.id);
        
        await prisma.computer.update({
            where: {
                id: computerId
            },
            data: {
                employeId: null
            }
        });
        
        return res.redirect("/?success=Ordinateur désassigné avec succès");
    } catch (error) {
        console.error("Erreur lors de la désassignation de l'ordinateur:", error);
        return res.redirect("/?error=Erreur lors de la désassignation de l'ordinateur");
    }
};