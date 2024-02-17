const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Display Login view
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        errors: null,
        title: "Login",
        nav,
    })
}

// Display Register view
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

// Process Registration
async function registerAccount(req, res){
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

    if (regResult) {
        req.flash("notice", `Congratulations, you are registered ${account_firstname}. Please log in.`)
        res.status(201).render("account/login", {
            errors: null,
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res){
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login",{
            title: "Login",
            nav,
            errors:null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            res.cookie("jwt", accessToken, {httpOnly:true, maxAge: 3600 * 1000})
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error("Access Forbidden")
    }
}

async function buildManagementHome(req, res) {
    let account_id = res.locals.accountData.account_id
    let nav = await utilities.getNav()
    let reviews = await utilities.getReviewsByAccount(account_id)
    res.render("account/management",{
        title: "Account Management",
        nav,
        errors: null,
        reviews,
    })
}

async function buildUpdatePage(req, res) {
    let nav = await utilities.getNav()
    let account_id = parseInt(req.params.account_id)
    let accountData = await accountModel.getAccountById(account_id)
    res.render("account/account-update",{
        title: "Account Update",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
    })
}

async function updateAccountInfo(req, res) {
    const {account_id, account_firstname, account_lastname, account_email} = req.body
    let nav = await utilities.getNav()
    let accountResult = await accountModel.updateInformation(account_id, account_firstname, account_lastname, account_email)
    if (accountResult){
        //Creation of new cookie to resfresh user information
        const accountData = await accountModel.getAccountById(account_id)
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
        res.cookie("jwt", accessToken, {httpOnly:true, maxAge: 3600 * 1000})
        req.flash("notice", "Account Information has been sucessfully updated!")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Unfortunately the account information could not be updated")
        res.status(501).render(`account/update/${account_id}`, {
            title: "Account Update",
            nav,
            errors: null,
            account_firstname: account_firstname,
            account_lastname: account_lastname,
            account_email: account_email,
        })
    }
}

// Updates password - hash new pasword and passes to model to update database
async function updateAccountPassword(req, res) {
    const {account_id, account_password} = req.body
    let nav = await utilities.getNav()
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error while trying to update password.")
        res.status(500).render("account/account-update", {
            title: "Account Update",
            nav,
            errors: null,
        })
    }
    let accountResult = await accountModel.updatePassword(account_id, hashedPassword)
    if (accountResult){
        req.flash("notice", "Account password has been sucessfully updated!")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Unfortunately the account password could not be updated")
        res.status(501).render(`account/update/${account_id}`, {
            title: "Account Update",
            nav,
            errors: null,
        })
    }
}

async function buildReviewEditPage(req, res){
    let nav = await utilities.getNav()
    let review_id = parseInt(req.params.review_id)
    let reviewData = await reviewModel.getReviewById(review_id)
    res.render("account/review/edit",{
        title: `Edit ${reviewData.inv_year} ${reviewData.inv_make} ${reviewData.inv_model}`,
        nav,
        errors: null,
        reviewDate: reviewData.review_date,
        review_text: reviewData.review_text,
        reviewId: review_id,
    })
}


async function buildReviewDeletePage(req, res){
    let nav = await utilities.getNav()
    let review_id = parseInt(req.params.review_id)
    let reviewData = await reviewModel.getReviewById(review_id)
    res.render("account/review/delete",{
        title: `Delete ${reviewData.inv_year} ${reviewData.inv_make} ${reviewData.inv_model} Review`,
        nav,
        review_id: review_id,
        review_date: reviewData.review_date,
        review_text: reviewData.review_text,
        errors: null,
    }) 
}


module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildManagementHome, buildUpdatePage, updateAccountInfo, updateAccountPassword, buildReviewEditPage, buildReviewDeletePage}