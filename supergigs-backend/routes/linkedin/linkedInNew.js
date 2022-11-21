const passport = require('passport');
const express = require('express');
var router = express.Router();
const sharetribeSdk = require("sharetribe-flex-sdk");
const { createIdToken } = require('./idToken');
var jwt = require('jwt-simple');
var secret = 'xxx';
// const cookieParser = require(' '); // in order to read cookie sent from client
const radix = 10;
const PORT = parseInt(process.env.PORT, radix);
const rootUrl = process.env.LOCAL_HOST_BACKEND_URL;
const linkedInclientID = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const clientId = process.env.SHARETRIBE_CLIENT_ID;
// Identity provider and identity provider client information. They should
// match to an identity provider client "Client ID" and "IdP ID" in Console.
const idpClientId = process.env.LINKEDIN_PROXY_CLIENT_ID;
const linkedInidpId = process.env.LINKEDIN_PROXY_IDP_ID;
const sharetribeClientSecret = process.env.SHARETRIBE_CLIENT_SECRET;


router.get('/auth/linkedin',  passport.authenticate('linkedin', {
  scope: ['r_emailaddress', 'r_liteprofile'],
}));

router.get('/auth/linkedin/callback',
passport.authenticate('linkedin', { failureRedirect: '/login' }),
function(req, res, user) {
  // Successful authentication, redirect home.
  
  const locale = Object.keys(res.req.user._json.firstName.localized)[0];
//   console.log("res>>",res.req.user.emails[0].value);
  const userData = {};
  const userId = res.req.user.id
  const firstName = res.req.user.name.givenName
  const lastName = res.req.user.name.familyName
  const email = res.req.user.emails[0].value 
  const totalData = res.req.user
  
  userData.userId = userId;
  userData.firstName = firstName;
  userData.lastName = lastName;
  userData.email = email;
  userData.totalData = totalData

  const rsaPrivateKey = process.env.RSA_PRIVATE_KEY;
  const keyId = process.env.KEY_ID;

  createIdToken(idpClientId, user, { signingAlg: 'RS256', rsaPrivateKey, keyId })
    .then(idpToken => {
      const userInfo = {
        email : userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userId:userData.userId,
        idpToken:idpToken,
      };

      // var string = encodeURIComponent(userInfo);
      // console.log('string',typeof string)
      // document.cookie = JSON.stringify(userInfo);
  // res.send(userInfo).redirect("http://localhost:3000/home");
  // res
  //     .cookie(
  //       'userData', userInfo,
  //       {
  //         maxAge: 15 * 60 * 1000, // 15 minutes
  //       }
  //     )
  //     .redirect("http://localhost:3000/confirmsignup");
  var token = jwt.encode(userInfo, secret);
  res.redirect(`https://dev.d1j40tfiqpchc4.amplifyapp.com/signupconfirm/?t=${token}`);
  // res.redirect(`http://localhost:3000/signupconfirm/?t=${token}`);


    //   const sdk = sharetribeSdk.createInstance({
    //             clientId: clientId,
    //             clientSecret: sharetribeClientSecret,
    //           })

    //   //   sdk.loginWithIdp({
    //   //   idpId: linkedInidpId,
    //   //   idpClientId: linkedInclientID,
    //   //   idpToken: idpToken,
    //   // })
    //   // .then((loginRes) => {
    //   //   console.log(loginRes.data);
        
    //   //   console.log("login Success");
    //   // })
    //   // .catch((loginError) => {
    //   //   console.log(loginError);
    //   //   if(loginError){}
    //   // });

    // sdk.currentUser
    // .createWithIdp(
    //   {
    //     idpId: linkedInidpId,
    //     idpClientId: linkedInclientID,
    //     idpToken: idpToken,
    //   },
    //   {
    //     expand: true,
    //   }
    // )
    // .then((SignUpres) => {
    // //   sdk
    // //     .loginWithIdp({
    // //       idpId: linkedInidpId,
    // //       idpClientId: linkedInclientID,
    // //       idpToken: idpToken,
    // //     })
    // //     .then((loginRes) => {
    // //       console.log("login Success");
    // //       console.log(loginRes);
    // //       res.redirect("http://localhost:3002/find-gigs");

    // //     })
    // //     .catch((err) => {
    // //       console.log(loginError);
    // //     });

    // console.log(SignUpres);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
    })


//   console.log("res>>",userInfo);

});

router.post("/signupconfirm",(req,res)=> {

  console.log(">>>inside",req.body.decoded)

   const sdk = sharetribeSdk.createInstance({
                clientId: clientId,
                clientSecret: sharetribeClientSecret,
              })

      //   sdk.loginWithIdp({
      //   idpId: linkedInidpId,
      //   idpClientId: linkedInclientID,
      //   idpToken: req.body.idpToken,
      // })
      // .then((loginRes) => {
      //   console.log(loginRes.data);
        
      //   console.log("login Success");
      // })
      // .catch((loginError) => {
      //   console.log(loginError);
      //   if(loginError){}
      // });

    sdk.currentUser
    .createWithIdp(
      {
        idpId: linkedInidpId,
        idpClientId: linkedInclientID,
        idpToken: req.body.decoded.idpToken,
      },
      {
        expand: true,
      }
    )
    .then((SignUpres) => {
    //   sdk
    //     .loginWithIdp({
    //       idpId: linkedInidpId,
    //       idpClientId: linkedInclientID,
    //       idpToken: idpToken,
    //     })
    //     .then((loginRes) => {
    //       console.log("login Success");
    //       console.log(loginRes);
    //       res.redirect("http://localhost:3002/find-gigs");

    //     })
    //     .catch((err) => {
    //       console.log(loginError);
    //     });

    console.log(SignUpres);
    })
    .catch((err) => {
      console.log(err);
    });
})

module.exports = router;