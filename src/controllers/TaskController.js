const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient({});

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status, assignmentType, employeId, employeIds } = req.body;
        
        if (assignmentType === 'individual') {
            // Créer une tâche pour un employé spécifique
            await prisma.task.create({
                data: {
                    title,
                    description,
                    dueDate: new Date(dueDate),
                    status,
                    employeId: parseInt(employeId)
                }
            });
        } else if (assignmentType === 'group') {
            // Créer des tâches pour un groupe d'employés
            const tasks = employeIds.map(empId => ({
                title,
                description,
                dueDate: new Date(dueDate),
                status,
                employeId: parseInt(empId)
            }));
            
            await prisma.task.createMany({
                data: tasks
            });
        } else if (assignmentType === 'all') {
            // Créer des tâches pour tous les employés
            const allEmployees = await prisma.employe.findMany();
            const tasks = allEmployees.map(emp => ({
                title,
                description,
                dueDate: new Date(dueDate),
                status,
                employeId: emp.id
            }));
            
            await prisma.task.createMany({
                data: tasks
            });
        }
        
        return res.redirect("/?success=Tâche(s) créée(s) avec succès");
    } catch (error) {
        console.error("Erreur lors de la création de la tâche:", error);
        return res.redirect("/?error=Erreur lors de la création de la tâche");
    }
};

// Mettre à jour le statut d'une tâche
exports.updateTaskStatus = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const { status } = req.body;
        
        await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                status
            }
        });
        
        return res.redirect("/?success=Statut de la tâche mis à jour");
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        return res.redirect("/?error=Erreur lors de la mise à jour du statut");
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
        
        return res.redirect("/?success=Tâche supprimée avec succès");
    } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
        return res.redirect("/?error=Erreur lors de la suppression de la tâche");
    }
};