const { PrismaClient } = require("../../generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient({});

exports.getLogin = async (req, res) => {
    res.render("pages/employee-login.twig", {
        error: req.query.error ? { message: req.query.error } : null
    });
};

exports.postLogin = async (req, res) => {
    try {
        const { mail, password } = req.body;
        
        // Vérifier si l'employé existe
        const employe = await prisma.employe.findUnique({
            where: {
                mail: mail
            }
        });
        
        if (!employe) {
            return res.render("pages/employee-login.twig", {
                error: { message: "Email ou mot de passe incorrect" }
            });
        }
        
        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, employe.password);
        
        if (!isPasswordValid) {
            return res.render("pages/employee-login.twig", {
                error: { message: "Email ou mot de passe incorrect" }
            });
        }
        
        // Stocker l'employé dans la session
        req.session.employe = {
            id: employe.id,
            mail: employe.mail,
            firstName: employe.firstName,
            lastname: employe.lastname
        };
        
        // Rediriger vers le tableau de bord
        res.redirect("/employee/dashboard");
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.render("pages/employee-login.twig", {
            error: { message: "Une erreur est survenue lors de la connexion" }
        });
    }
};

exports.logout = (req, res) => {
    req.session.employe = null;
    res.redirect("/employee/login");
};