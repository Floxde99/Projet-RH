const { PrismaClient } = require("../../generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient({});

// Récupérer tous les employés pour la page principale
exports.getAllEmployes = async (req, res) => {
    try {
        const employes = await prisma.employe.findMany({
            where: {
                businessOwnerId: req.session.user.id
            },
            include: {
                computer: true
            }
        });
        
        return employes;
    } catch (error) {
        console.error("Erreur lors de la récupération des employés:", error);
        return [];
    }
};

// Créer un nouvel employé
exports.createEmploye = async (req, res) => {
    try {
        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Création de l'employé dans la base de données
        const employe = await prisma.employe.create({
            data: {
                lastname: req.body.lastname,
                firstName: req.body.firstName,
                mail: req.body.mail,
                password: hashedPassword,
                birthDate: req.body.birthDate ? new Date(req.body.birthDate) : null,
                gender: req.body.gender || null,
                businessOwnerId: parseInt(req.body.businessOwnerId)
            }
        });
        
        return res.redirect("/?success=Employé ajouté avec succès");
    } catch (error) {
        console.error("Erreur lors de la création de l'employé:", error);
        
        // Gestion des erreurs de contrainte unique (email déjà existant)
        if (error.code === "P2002" && error.meta?.target?.includes("mail")) {
            return res.redirect("/?error=Cet email est déjà utilisé");
        }
        
        return res.redirect("/?error=Erreur lors de la création de l'employé");
    }
};

// Mettre à jour un employé existant
exports.updateEmploye = async (req, res) => {
    try {
        const employeId = parseInt(req.params.id);
        
        // Vérification que l'employé appartient bien à l'entreprise de l'utilisateur
        const employe = await prisma.employe.findFirst({
            where: {
                id: employeId,
                businessOwnerId: req.session.user.id
            }
        });
        
        if (!employe) {
            return res.redirect("/?error=Employé non trouvé");
        }
        
        // Mise à jour de l'employé
        await prisma.employe.update({
            where: {
                id: employeId
            },
            data: {
                lastname: req.body.lastname,
                firstName: req.body.firstName,
                mail: req.body.mail,
                birthDate: req.body.birthDate ? new Date(req.body.birthDate) : null,
                gender: req.body.gender || null
            }
        });
        
        return res.redirect("/?success=Employé mis à jour avec succès");
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'employé:", error);
        
        // Gestion des erreurs de contrainte unique
        if (error.code === "P2002" && error.meta?.target?.includes("mail")) {
            return res.redirect("/?error=Cet email est déjà utilisé");
        }
        
        return res.redirect("/?error=Erreur lors de la mise à jour de l'employé");
    }
};

// Supprimer un employé
exports.deleteEmploye = async (req, res) => {
    try {
        const employeId = parseInt(req.params.id);
        
        // Vérification que l'employé appartient bien à l'entreprise de l'utilisateur
        const employe = await prisma.employe.findFirst({
            where: {
                id: employeId,
                businessOwnerId: req.session.user.id
            }
        });
        
        if (!employe) {
            return res.redirect("/?error=Employé non trouvé");
        }
        
        // Suppression de l'employé
        await prisma.employe.delete({
            where: {
                id: employeId
            }
        });
        
        return res.redirect("/?success=Employé supprimé avec succès");
    } catch (error) {
        console.error("Erreur lors de la suppression de l'employé:", error);
        return res.redirect("/?error=Erreur lors de la suppression de l'employé");
    }
};