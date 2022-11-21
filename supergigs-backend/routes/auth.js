const router = require("express").Router();
const passport = require("passport");

require("dotenv").config();

const localHostURL = process.env.LOCAL_HOST_URL;

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({

        success:true,
        message: "success",
        user: req.user,
        cookies: req.cookies
    })
  } 
});
router.get("/login/failed", (req, res) => {
  console.log("fail", req);
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/login/success/signin", (req, res) => {
  console.log(">>>", req);
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "success",
      user: req.user,
      cookies: req.cookies,
    });
  }
});
router.get("/login/failed/signin", (req, res) => {
  console.log("fail", req);
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get(
  "/google/signup",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google/signin",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/login/success",
    failureRedirect: "/auth/login/failed",
  })
);

// router.get(
//   "/google/login/callback",
//   passport.authenticate("google", {
//     successRedirect: "/auth/login/success/signin",
//     failureRedirect: "/auth/login/failed/signin",
//   })
// );

module.exports = router;
