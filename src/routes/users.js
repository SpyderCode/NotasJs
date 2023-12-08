const express = require('express');
const router = express.Router();
const passport = require("passport");

//Modelo de datos de usuarios
const Usuario = require("../models/Users");

//Autentificacion de usuarios
const {isAuthenticated} = require("../helpers/auth");

//Ruta para iniciar sesion
router.get('/users/signin', (req, res) => {
    res.render("users/signin");
});

router.get("/users/logout", (req,res) =>{
    req.session.destroy((err) =>{
        if(err){
            return next(err);
        }

        req.session = null;

        res.redirect("/");
    })
})

//Ruta para registro de usuarios
router.get('/users/signup', (req, res) => {
    res.render("users/signup");
});

//Ruta post para el formulario del registro
router.post('/users/signup', async (req, res) => {
    const { nombre, email, password, confirmarpassword } = req.body;
    const errores = [];


    if (!nombre)
        errores.push({ text: "Porfavor inserta el nombre" });
    if (!email)
        errores.push({ text: "Porfavor inserta el email" });
    if (!password)
        errores.push({ text: "Porfavor inserta el password" });
    if (password.length < 5)
        errores.push({ text: "La contraseña es menor de 5 caracteres" });
    if (password != confirmarpassword)
        errores.push({ text: "La confirmacion de la contraseña no coincide" });
    if (errores.length > 0)
        res.render("users/signup",
            { errores, nombre, email, password, confirmarpassword }
        );
    else {
        const emailUser = await Usuario.findOne({ email: email });
        if (emailUser) {
            errores.push({ text: "El email ya esta registrado, elija uno diferente" });
            res.render("users/signup",
                { errores, nombre, email, password, confirmarpassword }
            );
            return;
        }
        const newUser = new Usuario({ nombre, email, password, tipo: 1 });
        //Encriptar la contraseña
        newUser.password = await newUser.encryptPassword(password);

        //Guardar el usuario en la base de datos
        await newUser.save()
            .then(() => {
                req.flash("success_msg", "Usuario registrado exitosamente");
                res.redirect("/users/signin")
            })
            .catch((err) => {
                console.log(err);
                res.redirect("/error");
            });
    }
});

//Metodo post para autentificar usuarios
router.post("/users/signin", passport.authenticate('local',{
    //So la autenticacion es correcta, redireccionamos a notas
    successRedirect: "/notes",
    //Si hay algun error, lo redirigimos a signin
    failureRedirect: "/users/signin",
    //activamos el envio de mensajes,
    failureFlash: true
}));

router.get("/users",isAuthenticated, async(req,res) =>{
    await Usuario.find().then((users) =>{
        res.render('users/consultar-users', {users});
    })
    .catch((err) =>{
        console.log(err);
        res.redirect("/error")
    });
});


module.exports = router;