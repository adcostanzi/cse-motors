const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const reviewController = require("../controllers/reviewController")
const regValidate = require("../utilities/account-validation")

// Deliver Default account management view
router.get("/", utilities.checkLogin, utilities.checkJWTToken, utilities.handleErrors(accountController.buildManagementHome))


//Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Deliver register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))


//Deliver update account view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdatePage))


//Deliver review delete view
router.get("/review/delete/:review_id", utilities.checkAuthor, utilities.handleErrors(accountController.buildReviewDeletePage))

// Deliver Delete of Review
router.post("/review/delete/:review_id", utilities.handleErrors(reviewController.deleteReview))


//Deliver review edit view
router.get("/review/edit/:review_id", utilities.checkAuthor, utilities.handleErrors(accountController.buildReviewEditPage))

// Deliver Edit of Review
router.post("/review/edit/:review_id",
regValidate.reviewRules(),
regValidate.checkReview,
utilities.handleErrors(reviewController.editReview))

//Deliver review delete view
//router.get("/review/delete/:review_id", utilities.handleErrors(accountController.buildReviewDeletePage))


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