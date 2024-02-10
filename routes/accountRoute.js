const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Deliver Default account management view
router.get("/", utilities.checkLogin, utilities.checkJWTToken, utilities.handleErrors(accountController.buildManagementHome))


//Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Deliver register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))


//Deliver update account view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdatePage))


//Deliver update of account password
router.post("/update-password",
regValidate.passwordUpdateRules(),
regValidate.checkAccountPassword,
utilities.handleErrors(accountController.updateAccountPassword))

//Deliver update of account information
router.post("/update/",
regValidate.accountUpdateRules(),
regValidate.checkAccountInformantion,
utilities.handleErrors(accountController.updateAccountInfo))



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
    utilities.handleErrors(accountController.accountLogin)
  )


module.exports = router;