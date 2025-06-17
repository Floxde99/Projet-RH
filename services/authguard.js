const authguard = (req, res, next) => {
    try {
        const user = process.env.AG_VALUE
        if (req.session.user) {
            return next();
        }else throw { message: "Vous devez être connecté pour accéder à cette page" };
    } catch (error) {
        res.redirect("/login");
        res.render("pages/login.twig", {
            error: { message: error.message },
            formData: {
                email: req.body.email || "",
                password: req.body.password || ""
            }
        });
    }
}
module.exports = authguard;