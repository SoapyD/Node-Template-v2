
const passport = require("passport");
const LocalStrategy = require("passport-local");
const models = require("../../models");

exports.setup = () => {
    //setup user authentication and password serialization and deserialization
    passport.use(new LocalStrategy(models.User.authenticate()));
    passport.serializeUser(models.User.serializeUser());
    passport.deserializeUser(models.User.deserializeUser())   
}