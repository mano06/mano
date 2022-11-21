const passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { createIdToken } = require('./idToken');
const sharetribeSdk = require("sharetribe-flex-sdk");

const radix = 10;
const PORT = parseInt(process.env.PORT, radix);
const rootUrl = process.env.LOCAL_HOST_BACKEND_URL;
const clientID = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const clientId = process.env.SHARETRIBE_CLIENT_ID;
// Identity provider and identity provider client information. They should
// match to an identity provider client "Client ID" and "IdP ID" in Console.
const idpClientId = process.env.LINKEDIN_PROXY_CLIENT_ID;
const linkedInidpId = process.env.LINKEDIN_PROXY_IDP_ID;

let callbackURL = null;

const useDevApiServer = process.env.NODE_ENV === 'development' && !!PORT;

if (useDevApiServer) {
  callbackURL = `http://localhost:3500/api/linkedin/callback`;
} else {
  callbackURL = `http://localhost:3500/api/linkedin/callback`;
}

const strategyOptions = {
  clientID,
  clientSecret,
  callbackURL,
  scope: ['r_emailaddress', 'r_liteprofile'],
  passReqToCallback: true,
};

const testFunc = (a,b,c,d) => {

    console.log("test a",a.query)
    console.log("test b",b)

    console.log("test c",c)
    console.log("test d",d)
}

const verifyCallback = (req, accessToken, refreshToken, profile, done) => {
  // We can can use util function to generate id token to match OIDC so that we can use
  // our custom id provider in Flex

  const locale = Object.keys(profile._json.firstName.localized)[0];

  const firstName = profile._json.firstName.localized[locale];
  const lastName = profile._json.lastName.localized[locale];
  const email = profile.emails[0].value;

  // LikedIn API doesn't return information if the email is verified or not directly.
  // However, it seems that with OAUTH2 flow authentication is not possible if the email is not verified.
  // There is no official documentation about this, but through testing it seems like this can be trusted
  // For reference: https://stackoverflow.com/questions/19278201/oauth-request-verified-email-address-from-linkedin

  const user = {
    userId: profile.id,
    firstName,
    lastName,
    email,
    emailVerified: true,
  };


  const state = req.query.state;
//   console.log(">>> state",state);
  const queryParams = JSON.parse(state);
// const queryParams = {};

  const { from, defaultReturn, defaultConfirm } = queryParams;
  console.log(">>> query params",queryParams);
  // These keys are used for signing the ID token (JWT)
  // When you store them to environment variables you should replace
  // any line brakes with '\n'.
  // You should also make sure that the key size is big enough.
  const rsaPrivateKey = process.env.RSA_PRIVATE_KEY;
  const keyId = process.env.KEY_ID;

  createIdToken(idpClientId, user, { signingAlg: 'RS256', rsaPrivateKey, keyId })
    .then(idpToken => {
      const userData = {
        email,
        firstName,
        lastName,
        idpToken,
        from,
        defaultReturn,
        defaultConfirm,
      };

      console.log("userdata",userData);
    //   console.log("token",idpToken);
    // return userData    
    done(null, userData);
    })


    .catch(e => console.error(e));
};



// ClientId is required when adding a new Linkedin strategy to passport
if (clientID) {
  passport.use(new LinkedInStrategy(strategyOptions, verifyCallback));
}

exports.authenticateLinkedin = (req, res, next) => {
    // console.log(">>> inside auth function",req.query.from, req.query.defaultReturn,req.query.defaultConfirm)
  const from = req.query.from ? req.query.from : null;
  const defaultReturn = req.query.defaultReturn ? req.query.defaultReturn : null;
  const defaultConfirm = req.query.defaultConfirm ? req.query.defaultConfirm : null;
// console.log(from, defaultConfirm,defaultReturn)
  console.log("inside 1st fn");
  const params = {
    ...(!!from && { from }),
    ...(!!defaultReturn && { defaultReturn }),
    ...(!!defaultConfirm && { defaultConfirm }),
  };

//   console.log(params);

  const paramsAsString = JSON.stringify(params);

  passport.authenticate('linkedin', {
    state: paramsAsString,
  })(req, res, next);
};

// Use custom callback for calling loginWithIdp enpoint
// to log in the user to Flex with the data from Linkedin

const sharetribeClientSecret = process.env.SHARETRIBE_CLIENT_SECRET;

// exports.authenticateLinkedinCallback = (req, res, next) => {

//     console.log("inside callback fn");
//   passport.authenticate('linkedin', function(err, user) {
//     // loginWithIdp(err, user, req, res, idpClientId, idpId);
//     const sdk = sharetribeSdk.createInstance({
//         clientId: clientID,
//         clientSecret: sharetribeClientSecret,
//       });

//       const responseObject = {};
//   try {
  

//     sdk
//       .loginWithIdp({
//         idpId: linkedInidpId,
//         idpClientId: req.body.clientId,
//         idpToken: req.body.token,
//       })
//       .then((loginRes) => {
//         console.log(loginRes.data);
//         responseObject["login"] = "success";
//         responseObject["loginResponse"] = loginRes.data;
//         responseObject["status"] = 200;
//         console.log("login Success");
//         response.status(200).json(responseObject);
//       })
//       .catch((loginError) => {
//         response
//           .status(loginError.status)
//           .json({ loginError: loginError, status: loginError.status });
//         console.log(loginError.status);
//       });
//   } catch (e) {
//     console.log(e);
//   }

//   })(req, res, next);
// };

// exports.authenticateLinkedinCallback = (req, res, next) => {
//     // console.log(">>>",req.user.idpToken);
//     passport.authenticate('linkedin', function(err, user) {
// //     //   loginWithIdp(err, user, req, res, idpClientId, idpId);
// //         console.log("inside callack",user);
// //     //   const sdk = sharetribeSdk.createInstance({
       
// //     //     clientId: clientID,
// //     //     clientSecret: sharetribeClientSecret,
// //     //   });
    
// //     //    sdk
// //     //     .loginWithIdp({
// //     //       idpId: linkedInidpId,
// //     //       idpClientId:idpClientId , 
// //     //       idpToken: req.user.idpToken, 
// //     //     })
// //     //     .then(response => {
// //     //       if (response.status === 200) {
// //     //         console.log("success");
// //     //       }
// //     //     })
// //     //     .catch(() => {
// //     //       console.log(
// //     //         'Authenticating with idp failed. User needs to confirm creating sign up in frontend.'
// //     //       );
    
// //     // })
// // })

// // passport.authenticate('linkedin', { failureRedirect: '/login' }),
// //   function(req, res) {
// //     // Successful authentication, redirect home.
// //     res.redirect('/');
// //   }
// // passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] })

// //  

// // responseObject = {}
// // const sdk = sharetribeSdk.createInstance({
// //     clientId: clientId,
// //     clientSecret: sharetribeClientSecret,
// //   });


// // sdk.currentUser
// //       .createWithIdp(
// //         {
// //           idpId: "google",
// //           idpClientId: "381986969505-9pv9f2j17kii7spheulmhnll36mhsh00.apps.googleusercontent.com",
// //           idpToken: req.user.idpToken,
// //         },
// //         {
// //           expand: true,
// //         }
// //       )
// //       .then((res) => {

// //         console.log(res)
// //         // sdk
// //         //   .loginWithIdp({
// //         //     idpId: linkedInidpId,
// //         //     idpClientId: idpClientId,
// //         //     idpToken: req.user.idpToken,
// //         //   })
// //         //   .then((loginRes) => {
// //         //     responseObject.success = true;
// //         //     responseObject.data = loginRes.data;
// //         //     responseObject.status = loginRes.status;
// //         //     console.log("login Success");
// //         //     console.log(loginRes);

// //         //     // response.status(200).json(responseObject);
// //         //   })
// //         //   .catch((err) => {
// //         //     responseObject.success = false;
// //         //     responseObject.data = err;
// //         //     responseObject.status = loginRes.status;
// //         //     // response.status(err.status).json(responseObject);
// //         //     console.log(loginError);
// //         //   });
// //       })
// //       .catch((err) => {
// //         responseObject.success = false;
// //         responseObject.data = err;
// //         responseObject.status = err.status;
// //         // response.status(err.status).json(err);
// //         console.log(err);
// //       });
// })
// }


exports.authenticateLinkedinCallback = (req, res, next) => {
    passport.authenticate('linkedin', function(err, user) {
    //   loginWithIdp(err, user, req, res, idpClientId, idpId);
    console.log("user inside callback",user);
    })(req, res, next);
  };