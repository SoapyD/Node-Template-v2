const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require("passport");

const controllers = require('../controllers');
const routes = require("../routes");
const utils = require("../utils");

const strategies = require('./strategies')

const classes = require('../classes');
global.database_handler = new classes.mongoose_db_handler();

exports.run = async(app) => {
    //setup sessions
    app.use(require("express-session")({
        secret: process.env.SESSION_SECRET, //used to encode and decode sessions
        resave: false,
        saveUninitialized: false
        }));
    app.use(passport.initialize());
    app.use(passport.session());
    

    //setup app
    app.set("view engine", "ejs"); //set ejs as the view engine
    app.use(bodyParser.urlencoded({ extended: true })); //setup body parser so it can read url parameters
    app.use(bodyParser.json()); //allow the app to read json input into the body


    app.use(express.static(__dirname + "/../public")); //setup a public folder for js and css
    app.use(methodOverride("_method")); //setup means of changing POST methods to DELETE and PUT methods
    app.use(flash()); //setup flash messages  

    //setup user authentication and password serialization and deserialization
    // passport.use(new LocalStrategy(models.User.authenticate()));
    // passport.serializeUser(models.User.serializeUser());
    // passport.deserializeUser(models.User.deserializeUser());
    strategies.local.setup();

    //setup the local variables
    app.use(function(req, res, next){
        res.locals.user = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");	
        next();
    })

    //automatically setup routes along route paths
    for (const [key, value] of Object.entries(routes)) {
        app.use(routes[key].path,routes[key]);
    }   
    app.use(controllers.error.get404);


    // utils.seeds.seedDB();

}