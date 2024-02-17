const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
    return list
  }


/* ************************
 * Constructs the select tag for the classification name selection in the add-inventory view
 ************************** */

Util.getClassificationSelect = async function (req = null, res, next) {
  let data = await invModel.getClassifications()
  let options = ""
  let selected =  ""
  let optional = "selected"
  data.rows.forEach((row) => {
    if (row.classification_id == req) {
      selected = "selected"
      optional = ""
    } else {
      selected = ""
    }
    options += `<option class="classification-option" value="${row.classification_id}" ${selected}>${row.classification_name}</option>`
  })
  let select = `<select name="classification_id" id="classificationList" required> <option ${optional} disabled value>Select an option</option>${options}</select>`
  return select
}




/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ""
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildDetailsPage = async function(data) {
  let page = ""
  if(Object.keys(data).length > 0){
    page += `
    <section class="car-details-section">
    <h2 class="car-title">${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
    <div class="car-img-container">
        <img src="${data.inv_image}" alt="${data.inv_year} ${data.inv_make} ${data.inv_model} picture">
    </div>
    <div class="car-details-subsection">
        <h3>${data.inv_make} ${data.inv_model} Details</h3>
        <span class="car-price">Price: $${new Intl.NumberFormat('en-US').format(data.inv_price)}</span>
        <span class="car-milage">Milage: ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</span>
        <p class="car-description">${data.inv_description}</p>
        <span class="car-color">Color: ${data.inv_color}</span>
    </div>
</section>
    `
  } else {
    page += `<p class="notice">Sorry, no matching vehicles could be found.</p>`
  }
  return page
} 


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


// Middleware to check token validity
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt){
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if(err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        //console.log("res.locals:", res.locals); // Log res.locals to see its properties
        next()
    })
  } else {
    res.locals.loggedin = 0
    next()
  }
}

// Clear token information
Util.clearJWTToken = (req, res) => {
  res.clearCookie("jwt")
  res.redirect("/")
}

// Check Login
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin){
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}


// Checks and allows/denies access depending on what account type the user has
Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin"){
    next()
  } else {
    req.flash("notice", "Access forbidden for clients. Please use other credentials")
    return res.redirect("/account/login")
  }
}


// Checks and allows/denies access depending on the user (only author allowed)
Util.checkAuthor = async function (req, res, next){
  let review_id = parseInt(req.params.review_id)
  let reviewInfo = await accountModel.getReviewAuthor(review_id)
  if (!res.locals.accountData){
    req.flash("notice", "Access forbidden. Please log in")
    return res.redirect("/account/login")
  } else if (res.locals.accountData.account_id == reviewInfo.account_id){
    next()
  } else {
    req.flash("notice", "Access forbidden. Only author can edit/delete reviews")
    return res.redirect("/account/login")
  }
}

// Get reviews and return them as HTML template
Util.getReviews = async function (inv_id) {
  const rawReviews = await invModel.getReviewsById(inv_id)
  let reviews = `<section class="review-section"><h3>Customer Reviews</h3>`
  if (rawReviews.rows.length > 0){
    rawReviews.rows.forEach((review) => {
      let name = `${review.account_firstname.charAt(0)}${review.account_lastname.replace(/\s/g, "")}`
      let date = new Date(review.review_date)
      let dateOptions = {month: "long", day:"numeric", year:"numeric"}
      reviews += `<div class="review">
      <span class="review-author"><b>${name}</b> wrote on ${date.toLocaleDateString("en-US", dateOptions)}</span>
      <hr class="review-separator">
      <p class="review-text">${review.review_text}</p>
      </div>`
    })
    reviews += `</section>`
  } else {
    reviews += `<span class="review-text no-reviews">There are no reviews for this item. Be the first one to leave a review!</span></section>`
  }
  return reviews
}

Util.getCarName = async function (inv_id){
  const carInfo = await invModel.getDetailsByInvId(inv_id)
  let carName = `${carInfo.inv_make} ${carInfo.inv_model}`
  return carName
}

Util.getReviewsByAccount = async function(account_id) {
  const rawReviews = await invModel.getReviewsByAccountId(account_id)
  let reviews = ""
  let dateOptions = {month: "long", day:"numeric", year:"numeric"}
  if (rawReviews.rows.length > 0){
    reviews += `<table>
    <tr><th>Vehicle Name</th><th>Date</th><td>&nbsp;</td><td>&nbsp;</td></tr>`
    rawReviews.rows.forEach((review) => {
      reviews += `<tr><td>${review.inv_year} ${review.inv_make} ${review.inv_model}</td>
      <td>${review.review_date.toLocaleDateString("en-US", dateOptions)}</td>
      <td><a href="/account/review/edit/${review.review_id}" title="Click to edit review">Edit</a></td>
      <td><a href="/account/review/delete/${review.review_id}" title="Click to delete">Delete</a></td></tr>`
    })
    reviews += "</table>"
  } else {
    reviews += "<span>You have not posted any reviews yet. Your feedback will be appreciated!</span>"
  }
  return reviews
}

  module.exports = Util