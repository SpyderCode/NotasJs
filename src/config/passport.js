const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

//Importamos el modelo de datos
const Usuario = require("../models/Users");

passport.use(new localStrategy(
    {
        usernameField: 'email',
    },
    //done es la variable donde regresamos la informacion
    //de la autentificacion
    async function (email, password, done){
        const usuario = await Usuario.findOne({email: email});
        if(!usuario){
            //null significa que no hay ningun error
            //false significa que no se encontro el usuario en la BD
            return done(null, false, {message: "No se encontro el usuario"});
        }else {
            //si se encontro el usuario
            //comprobar que la contraseña que viene del formulario
            //coincida con la almacenada en la bd
            const coincide = await usuario.matchPassword(password);
            if(coincide){
                //null indica que no hay ningun error
                //user indica que se encontro un usuario en la bd con ese email
                //y que coincide con el password enviado
                return done(null, usuario);
            }else{
                //La contraseña no coincide o es incorrecta
                return done(null, false, {message: "Password incorrecto"});
            }
        }
    }
));

passport.serializeUser((usuario,done) =>{
    done(null, usuario._id);
});

passport.deserializeUser((id,done) =>{
    Usuario.findById(id)
    .then((usuario) => {
        done(null,usuario);
    })
    .catch((err) =>{
        console.log(err);
        done(err,null);
    });
});