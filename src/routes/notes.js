const express = require('express');
const router = express.Router();

//Modelo de datos de Notas
const Nota = require('../models/Notes');

//Autenticacion de usuarios
const {isAuthenticated} = require("../helpers/auth");

//Ruta para agregar rutas
router.get('/notes/add', isAuthenticated, (req,res) =>{
    res.render('notes/nueva-nota');
});


//Ruta para listar las notas
router.get('/notes', isAuthenticated, async (req,res) =>{
    await Nota.find({usuario: req.user._id}).lean().sort({fecha:'desc'})
    .then((notas) => {
        //console.log(notas);
        //res.send("Notas");
        res.render('notes/consultar-notas', {notas});
    })
    .catch((err) =>{
        console.log(err);
        res.redirect("/error");
    });
});

//Ruta para procesar el formulario
router.post('/notes/nueva-nota', isAuthenticated, async (req,res) => {
    //req.body contiene todos los datos enviados desde el frontend
    //Obtenemos los datos en constantes
    const {titulo, descripcion} = req.body;
    console.log(titulo, descripcion);
    const errores = [];

    if(!titulo){
        errores.push({text: "Por favor inserta el titulo"});
    }
    if(!descripcion){
        errores.push({text: "por favor inserte la descripcion"});
    }

    if(errores.length > 0)
        res.render("notes/nueva-nota", {
            errores,
            titulo,
            descripcion
    })
    else{
        const id = req.user._id;
        const nuevaNota = new Nota({titulo, descripcion, usuario: id});
        await nuevaNota.save()
            .then(() => {
                //Enviamos un mensaje al frontend
                req.flash("success_msg", "Nota agregada de manera exitosa");
                res.redirect("/notes");
            })
            .catch((err) => {
                console.log(err);
                res.redirect("/error");
            });
        //console.log(nuevaNota);
        //res.send("ok");
    }
        
});

//Ruta para editar una nota
router.get('/notes/edit:id', isAuthenticated, async (req,res) =>{
    //console.log(req.params.id);
    //res.send("Ok");

    //Eliminamos los : que se incluyen en el id
    try {
        var _id = req.params.id;
        //Extraer una subcadena de la posicion 1 a la longitud tota
        //del id, porque la posicion 0 del id son los :
        //son los que vamos a eliminar
        _id = _id.substring(1);
        const nota = await Nota.findById(_id);
        _id = nota._id;
        var titulo = nota.titulo;
        var descripcion = nota.descripcion;

        res.render("notes/editar-nota", {titulo, descripcion, _id});
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }

});

router.put("/notes/editar-nota/:id", isAuthenticated, async (req,res) => {
    const {titulo,descripcion} = req.body;
    const _id = req.params.id;
    const errores = [];

    if(!titulo){
        errores.push({text: "Por favor inserta el titulo"});
    }
    if(!descripcion){
        errores.push({text: "por favor inserte la descripcion"});
    }

    if(errores.length > 0)
        res.render("notes/edit/:"+_id, {
            errores,
            titulo,
            descripcion
    })
    else{ //no hay errores, se actualiza la nota en la BD
        await Nota.findByIdAndUpdate(_id,{titulo,descripcion})
            .then(() =>{
                req.flash("success_msg", "Nota actualizada correctamente");
                res.redirect("/notes");
            })
            .catch((err) =>{
                console.log(err);
                res.redirect("/error");
            })
    }

});

//Ruta para eliminar una nota
router.get("/notes/delete:id", isAuthenticated, async (req,res) => {
    //Eliminar los dos puntos del id
    try {
        var _id = req.params.id;
        _id = _id.substring(1);

        await Nota.findByIdAndDelete(_id);
        req.flash("success_msg", "Nota eliminada correctamente");
        res.redirect("/notes/");
    } catch (error) {
        res.send(404);
        console.log(error);
        res.redirect("/error");
    }
});

module.exports = router;