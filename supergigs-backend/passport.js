const GoogleStrategy = require("passport-google-oauth20").Strategy;

const passport = require("passport");
require('dotenv').config();
const sharetribeSdk = require("sharetribe-flex-sdk");

//taken from env 
const clientId = process.env.SHARETRIBE_CLIENT_ID


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: "381986969505-9pv9f2j17kii7spheulmhnll36mhsh00.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },
    async function (req, accessToken,params, profile, done) {
        // console.log('req, ',req)
        // console.log("accesstoken",accessToken);
        // console.log('profiel ??',profile._json.email);
        console.log('params >> ',params)
        // console.log('done')

        let username = profile._json.email;
        let password = "Supergigs@123"
        let firstName = profile._json.given_name;
        let lastName = profile._json.family_name;
        let displayName = profile.displayName;
        const sdk = sharetribeSdk.createInstance({
          clientId: clientId,
        });

        // sdk.currentUser
        // .create(
        //   {
        //     email: username,
        //     password: password,
        //     firstName: firstName,
        //     lastName: lastName,
        //     displayName: displayName,
        //     bio: "",
        //     publicData: {
        //       age: 27,
        //     },
        //     protectedData: {
        //       phoneNumber: "+1-202-555-5555",
        //     },
        //     privateData: { 
        //       discoveredServiceVia: "Twitter",
        //     },
        //   },
        //   {
        //     expand: true,
        //   }
        // )
        // .then((res) => {
        //   console.log("user successfully registered");
        //   // response.json(res);
        // }).then((res)=>{


        //   sdk.login({
        //     username: username,
        //     password: password
        //   }).then(loginRes => {
        //     console.log("Login successful.")
        //     sdk.currentUser.sendVerificationEmail().then(res => {
        //       console.log("mail sent");
               
              

        //       sdk.login({
        //         username: "user@example.com",
        //         password: "secret-password"
        //       }).then(loginRes => {
        //         console.log("Login successful.")
        //       });
              
        //       // res.data
        //     })
        //   });
        // })


        console.log("signup api");
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

