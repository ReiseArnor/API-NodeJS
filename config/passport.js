var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Usuario = require("../models/usuarios");

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  async(email, password, done) => {
    const user = await Usuario.findOne({ email: email });
    if (!user) {
      return done(null, false, { // Return si el usuario no esta en la base de datos
        mensaje: 'Usuario no encontrado'
      });
    }else {
      const match = await user.validPassword(password);
      if (!match) {  
        return done(null, false, { // Return si la contraseña esta mal
          mensaje: 'Contraseña esta mal'
        });
      }else{
        return done(null, user); // Return el usuario
      }
    }   
  }
));

passport.serializeUser((user, done) =>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  Usuario.findById(id,(err, user)=>{
    done(err, user);
  });
});