const express = require("express");
const router = express.Router();
const sharetribeSdk = require("sharetribe-flex-sdk");
const bodyParser = require("body-parser");
require("dotenv").config();

// taken from env file
const clientId = process.env.SHARETRIBE_CLIENT_ID;
const sharetribeClientSecret = process.env.SHARETRIBE_CLIENT_SECRET;
const googleIdp = "google";

const linkedInIdp = "linkedin client ID"

// for parsing the request and getting the body
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.post("/login", (req, response) => {
  console.log("shanavas", req.body);
  const sdk = sharetribeSdk.createInstance({
    clientId: clientId,
  });

  sdk
    .login({ username: req.body.username, password: req.body.password })
    .then((loginRes) => {
      console.log("Login successful.",loginRes);
      response.status(200).json({ data: loginRes });
    })
    .catch((error) => {
      response.status(error.status).json({ error: error });
    });
   
});

router.post("/login/google", (req, response) => {
  // console.log(req.body.token);
  const sdk = sharetribeSdk.createInstance({
    clientId: clientId,
    clientSecret: sharetribeClientSecret,
  });

  const responseObject = {};
  try {
    console.log("clientId", req.body.clientId);
    console.log("token", req.body.token);

    sdk
      .loginWithIdp({
        idpId: linkedInIdp,
        idpClientId: req.body.clientId,
        idpToken: req.body.token,
      })
      .then((loginRes) => {
        console.log(loginRes.data);
        responseObject["login"] = "success";
        responseObject["loginResponse"] = loginRes.data;
        responseObject["status"] = 200;
        console.log("login Success");
        response.status(200).json(responseObject);
      })
      .catch((loginError) => {
        response
          .status(loginError.status)
          .json({ loginError: loginError, status: loginError.status });
        console.log(loginError.status);
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/login/linkedin", (req, response) => {
  // console.log(req.body.token);
  const sdk = sharetribeSdk.createInstance({
    clientId: clientId,
    clientSecret: sharetribeClientSecret,
  });

  const responseObject = {};
  try {
    console.log("clientId", req.body.clientId);
    console.log("token", req.body.token);

    sdk
      .loginWithIdp({
        idpId: linkedInIdp,
        idpClientId: req.body.clientId,
        idpToken: req.body.token,
      })
      .then((loginRes) => {
        console.log(loginRes.data);
        responseObject["login"] = "success";
        responseObject["loginResponse"] = loginRes.data;
        responseObject["status"] = 200;
        console.log("login Success");
        response.status(200).json(responseObject);
      })
      .catch((loginError) => {
        response
          .status(loginError.status)
          .json({ loginError: loginError, status: loginError.status });
        console.log(loginError.status);
      });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
