const { PrismaClient } = require("../../generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient({});



exports.getRegister = async (req, res) => {
    res.render("pages/register.twig");
};

exports.postRegister = async (req, res) => {
    console.log("postRegister called");
    const validations = {
    name: /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,50}$/,
    companyName: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-&'.()]{2,100}$/,
    siret: /^\d{14}$/,
    email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};
    try {
        console.log("Validating form data");
        
        const errors = {};


        if (!validations.name.test(req.body.name)) {
            errors.name = "Le nom du responsable n'est pas valide";
        }

        if (!validations.companyName.test(req.body.companyName)) {
            errors.companyName = "Le nom de l'entreprise n'est pas valide";
        }

        if (!validations.siret.test(req.body.siret)) {
            errors.siret = "Le numéro SIRET doit contenir exactement 14 chiffres";
        }

        if (!validations.email.test(req.body.email)) {
            errors.email = "L'adresse email n'est pas valide";
        }

        if (!validations.password.test(req.body.password)) {
            errors.password =
                "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";
        }

        if (req.body.password !== req.body.confirmPassword) {
            errors.confirmPassword = "Les mots de passe ne correspondent pas";
        }


        if (Object.keys(errors).length > 0) {
            return res.render("pages/register.twig", {
                errors: errors,
                formData: req.body,
            });
        }

        const hash = await bcrypt.hash(req.body.password, 10);
        const businessOwner = await prisma.BusinessOwner.create({
            data: {
                email: req.body.email,
                password: hash,
                name: req.body.name,
                companyName: req.body.companyName,
                siret: req.body.siret,
            },
        });
        console.log("ok!!");
        
        res.redirect("/login");
    } catch (error) {
        console.log("error");
        
        if (error.code === "P2002") {
            error.message = `Ce ${
                field === "email"
                    ? "email"
                    : field === "siret"
                    ? "numéro SIRET"
                    : field
            } est déjà utilisé`;
        }
        console.log(error);
        
        res.render("pages/register.twig", {
            error: { message: error.message },
            formData: req.body,
        });
    }
};

exports.getlogin = async (req, res) => {
    res.render("pages/login.twig");
};
exports.postLogin = async (req, res) => {
    try {
        const rh = await prisma.BusinessOwner.findUnique({
            where: {
                siret: req.body.siret,
            },
        });
        console.log(rh);
        
        if (rh){
            if (await bcrypt.compare(req.body.password, rh.password)) {
                req.session.user = rh;
                res.redirect("/");
                
            } else {
                throw {password: "Mot de passe incorrect"};
            }
        }else {
            throw {siret: "Numéro SIRET incorrect"};
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.render("pages/login.twig", {
            error: { message: "Erreur lors de la connexion" },
        });
        
    }}
    exports.logout = async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error("Erreur lors de la déconnexion :", err);
                return res.redirect("/?error=Erreur lors de la déconnexion");
            }
            res.redirect("/login");
        });
    }