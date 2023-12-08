const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");

//Inicializaciones
const app = express();
require('./database');
require("./config/passport")

//Configuraciones
app.set("puerto", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine('.hbs', engine({
  defaultLayout:'main',
  defaultDir: path.join('views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  extname: 'hbs',
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true
  }
}));
app.set('view engine','hbs');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: "mysecretapp.2023#",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables Globales
app.use(function(req,res,next){
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.usuario = req.user || null;

  
  next();

});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Archivo estaticos
app.use(express.static(path.join(__dirname,'public')));

//Servidor
app.listen(app.get("puerto"), () => {
  let port = app.get("puerto");
  console.log("Servidor corriendo en el puerto " + port);
});
