const helpers = {};

helpers.isAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated())
        return next();
    else { //No hay autentificacion
        req.flash("error_msg", "No autorizado, no ha iniciado sesion");
        res.redirect("/users/signin");
    }
}

module.exports = helpers;