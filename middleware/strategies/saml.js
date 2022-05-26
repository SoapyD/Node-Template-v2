
const passport = require("passport");
const SamlStrategy = require('passport-saml').Strategy;
// const models = require("../models");

exports.setup = () => {
    //setup user authentication and password serialization and deserialization
    passport.use(new SamlStrategy(
        {
          entryPoint: process.env.SAML_ENTRY_POINT,
          issuer: process.env.SAML_ISSUER,
          callbackUrl: process.env.SAML_CALLBACK,
          disableRequestedAuthnContext: true
        },
        function (profile, done) {
          // console.log(profile)
          // console.log(profile["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
          return done(null,
            {
              id: profile["http://schemas.microsoft.com/identity/claims/objectidentifier"],
              id_name: profile.nameID,
              role: profile["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
              name: profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        done(null, user);
    });    
}