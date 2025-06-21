const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const authguard = async (req, res, next) => {
    try {
        if (req.session.user) {
           
            const userFound = await prisma.businessOwner.findUnique({
                where: {
                    id: req.session.user.id
                }
            });
            
            if (userFound) {
                return next();
            } else {
                throw { message: "Utilisateur non trouvé" };
            }
        } else {
            throw { message: "Vous devez être connecté pour accéder à cette page" };
        }
    } catch (error) {
        console.log(error);
        res.redirect("/login");
    }
}

module.exports = authguard;