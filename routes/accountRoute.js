const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")


//Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Deliver register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Deliver Registration Post to Model
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))


// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors((req, res) => {
      res.status(200).send('login process')
    })
  )


module.exports = router;