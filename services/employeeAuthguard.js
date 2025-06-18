module.exports = function(req, res, next) {
    if (req.session && req.session.employe) {
        return next();
    } else {
        return res.redirect('/employee/login');
    }
};