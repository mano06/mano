const express = require("express");
const router = express.Router();
const sharetribeSdk = require("sharetribe-flex-sdk");
const bodyParser = require("body-parser");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const passport = require("passport");
const { use } = require("passport");
require('dotenv').config();
// taken from env file
const clientId = process.env.SHARETRIBE_CLIENT_ID;

// for parsing the request and getting the body
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());


  passport.use(
    new GoogleStrategy(
      {
        clientID: "381986969505-9pv9f2j17kii7spheulmhnll36mhsh00.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/auth/google/callback",
      },
      async function (req, accessToken,params, profile, done) {
        console.log("inside callback");
          // console.log('req, ',req)
          // console.log("accesstoken",accessToken);
          // console.log('profiel ??',profile._json.email);
          // console.log('params >> ',params)
          // console.log('done')
  
          let username = profile._json.email;
          let password = "Supergigs@123"
          // let firstName = profile._json.given_name;
          // let lastName = profile._json.family_name;
          // let displayName = profile.displayName;

          console.log(username);
          const sdk = sharetribeSdk.createInstance({
            clientId: clientId,
          });
  
          sdk
          .login({ username: username, password: password })
          .then((loginRes) => {
            console.log("Login successful.");
      
            console.log(loginRes.status);
          
          });
          console.log("login api");
        done(null, profile);
        
      }
    )
  );
  
  passport.serializeUser((user, done) => {
          done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  

module.exports = router;
