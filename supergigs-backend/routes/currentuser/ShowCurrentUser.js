const sharetribeSdk = require("sharetribe-flex-sdk");
const router = require("../auth");
const { route } = require("../auth");
const bodyParser = require("body-parser");
var axios = require('axios');
var responseData = require("../../model/response")

// async function fetchUserDetails  (token) {

//   let fetchedData = {};
//   await axios
//   .get("https://flex-api.sharetribe.com/v1/api/current_user/show", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   .then((response) => {

//     fetchedData = response
//     console.log(">>>",fetchedData);
//     return fetchedData;

//   });

  
// }

// }

// }

// for parsing the request and getting the body
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

const clientId = process.env.SHARETRIBE_CLIENT_ID;

router.get("/currentUser", (req, res) => {
  const sdk = getSdk(req, res);
  // const sdk = sharetribeSdk.createInstance({
  //   clientId: clientId,
  // });
  console.log("currentuser API");

const clientId = process.env.SHARETRIBE_CLIENT_ID

})

router.get("/",(req,res) => {

  // const token = req.get('Authorization')
    
    const sdk = sharetribeSdk.createInstance({
      clientId: clientId,
    });
    


    // sdk
    // .login({ username: "shanavas@1cloudhub.com", password: "qwerty123" })
    // .then((loginRes) => {
      
      sdk.currentUser.show().then(res => {
        // res.data contains the response data

    console.log(res.data.data.attributes);



    });

     
    // });

    res.json(res.data);

    
  //   axios
  // .get("https://flex-api.sharetribe.com/v1/api/current_user/show", {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: token,
  //   },
  // })
  // .then((data) => {

  //   // console.log(data.data.data);
  //   responseData['data'] = data.data.data;
  //   responseData['success'] = true;
  //   responseData['status'] = data.data.status;
  //   console.log(responseData);

  //   res.json(responseData);
  });
  
   
// });


router.post("/update",(req,res) => {


    console.log(req.body);

    let body = req.body;
    const sdk = sharetribeSdk.createInstance({
      clientId: clientId,
    });


//  sdk
//     .login({ username: "shanavas@1cloudhub.com", password: "qwerty123" })
    // .then((loginRes) => {

        sdk.currentUser.updateProfile(
            {
           
            publicData: body
           
          }, {
            expand: true,
            include: ["profileImage"]
          }).then(res => {
            // res.data
            // res.json(res.data);
            console.log(res)
          });
    })


    // res.json(res.data);

// module.exports = router;
  
module.exports = router;