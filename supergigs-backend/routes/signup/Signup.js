const express = require("express");
const router = express.Router();
const sharetribeSdk = require("sharetribe-flex-sdk");
const bodyParser = require("body-parser");
const responseObject = require("../../model/response");
require("dotenv").config();

//taken from env
const clientId = process.env.SHARETRIBE_CLIENT_ID;
const sharetribeClientSecret = process.env.SHARETRIBE_CLIENT_SECRET;

const googleIdp = "google";

const linkedInIdp = "linkedin"
// for parsing the request and getting the body
// router.use(bodyParser.urlencoded({
//     extended: true
//   }));
// router.use(bodyParser.json());

router.post("/signup", (req, response) => {
  const sdk = sharetribeSdk.createInstance({
    clientId: clientId,
  });

  try {
    console.log(req);
    console.log(req.body.username);
    console.log(req.body.password);

    sdk.currentUser
      .create(
        {
          email: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        {
          expand: true,
        }
      )
      .then((res) => {
        console.log("success");
        sdk
          .login({ username: req.body.username, password: req.body.password })
          .then((loginRes) => {
            console.log("Login successful.");
            responseObject.success = true;
            responseObject.data = loginRes.data;
            responseObject.status = 200;
            response.status(200).json(responseObject);
            // sdk.currentUser.sendVerificationEmail().then((emailres) => {});
          })
          .catch((error) => {
            responseObject.success = false;
            responseObject.data = error;
            responseObject.status = error.status;
            console.log(error);
            response.status(error.status).json(responseObject);
          });
      })
      .catch((error) => {
        // console.log(error);

        responseObject.success = false;
        responseObject.data = error;
        responseObject.status = error.status;
        response.status(error.status).json(responseObject);
      });
  } catch (e) {
    console.log(e);
    responseObject.success = false;
    responseObject.data = error;
    responseObject.status = error.status;
    response.status(error.status).json(responseObject);
  }
});

// signup

router.post("/signup/linkedin", (req, response) => {
  // console.log(req.body.token);
  const sdk = sharetribeSdk.createInstance({
    clientId: clientId,
    clientSecret: sharetribeClientSecret,
  });
  console.log("responseObj >>", responseObject);

  // const responseObject = {};
  try {
    console.log("clientId", req.body.clientId);
    console.log("token", req.body.token);

    sdk.currentUser
      .createWithIdp(
        {
          idpId: linkedInIdp,
          idpClientId: req.body.clientId,
          idpToken: req.body.token,
        },
        {
          expand: true,
        }
      )
      .then((res) => {
        sdk
          .loginWithIdp({
            idpId: linkedInIdp,
            idpClientId: req.body.clientId,
            idpToken: req.body.token,
          })
          .then((loginRes) => {
            responseObject.success = true;
            responseObject.data = loginRes.data;
            responseObject.status = loginRes.status;
            console.log("login Success");
            console.log(loginRes);

            response.status(200).json(responseObject);
          })
          .catch((err) => {
            responseObject.success = false;
            responseObject.data = err;
            responseObject.status = loginRes.status;
            response.status(err.status).json(responseObject);
            console.log(loginError);
          });
      })
      .catch((err) => {
        responseObject.success = false;
        responseObject.data = err;
        responseObject.status = err.status;
        response.status(err.status).json(err);
        console.log(err);
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/signup/google", (req, response) => {
  // console.log(req.body.token);
  const sdk = sharetribeSdk.createInstance({
    clientId: clientId,
    clientSecret: sharetribeClientSecret,
  });
  console.log("responseObj >>", responseObject);

  // const responseObject = {};
  try {
    console.log("clientId", req.body.clientId);
    console.log("token", req.body.token);

    sdk.currentUser
      .createWithIdp(
        {
          idpId: googleIdp,
          idpClientId: req.body.clientId,
          idpToken: req.body.token,
        },
        {
          expand: true,
        }
      )
      .then((res) => {
        sdk
          .loginWithIdp({
            idpId: googleIdp,
            idpClientId: req.body.clientId,
            idpToken: req.body.token,
          })
          .then((loginRes) => {
            responseObject.success = true;
            responseObject.data = loginRes.data;
            responseObject.status = loginRes.status;
            console.log("login Success");
            console.log(loginRes);

            response.status(200).json(responseObject);
          })
          .catch((err) => {
            responseObject.success = false;
            responseObject.data = err;
            responseObject.status = loginRes.status;
            response.status(err.status).json(responseObject);
            console.log(loginError);
          });
      })
      .catch((err) => {
        responseObject.success = false;
        responseObject.data = err;
        responseObject.status = err.status;
        response.status(err.status).json(err);
        console.log(err);
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/signup/linkedin", (req, response) => {
  // console.log(req.body.token);
  const sdk = sharetribeSdk.createInstance({
    clientId: clientId,
    clientSecret: sharetribeClientSecret,
  });
  console.log("responseObj >>", responseObject);

  // const responseObject = {};
  try {
    console.log("clientId", req.body.clientId);
    console.log("token", req.body.token);

    sdk.currentUser
      .createWithIdp(
        {
          idpId: "linkedinauth",
          idpClientId: "8644tgrwzw20xi",
          // idpToken: req.body.token,
          idpToken : "AQVsnKepShv-y-rXklIhQPm_6XgNuz_LYrBC34jL0dcbV1D7C_I1v2RTJo0wPCJJEfmeUQMO0JvNZ2WdQLHjJudTDPUn3T6LGRdLXMyYLipP6otI_eteGP8g1iEEChwLcl6sRNc1pNWszkISV5fRTwMa75wh8VC15ImrGN7ZGWgHDEa2_Hyl3FDZ7v5kFlUr_eJw-AxQUwy774fowM2AbeWrg5pVU4toUXRks1tZrFkS01AV512Wf4vWmZK3XWtE2AcnoDpm7ZrNkxraoFTvjjdf4SvZnTJ1VkMCRPDwgqKQsUKiWrub4cze3UEaC3dlKSbC3xrnEervON8yfUAviJouPZXpCg"
        },
        {
          expand: true,
        }
      )
      .then((res) => {
        sdk
          .loginWithIdp({
            idpId: linkedInIdp,
            idpClientId: req.body.clientId,
            idpToken: req.body.token,
          })
          .then((loginRes) => {
            responseObject.success = true;
            responseObject.data = loginRes.data;
            responseObject.status = loginRes.status;
            console.log("login Success");
            console.log(loginRes);

            response.status(200).json(responseObject);
          })
          .catch((err) => {
            responseObject.success = false;
            responseObject.data = err;
            responseObject.status = loginRes.status;
            response.status(err.status).json(responseObject);
            console.log(loginError);
          });
      })
      .catch((err) => {
        responseObject.success = false;
        responseObject.data = err;
        responseObject.status = err.status;
        response.status(err.status).json(err);
        console.log(err);
      });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
