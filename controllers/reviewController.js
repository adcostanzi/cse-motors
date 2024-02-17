const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")

const reviewCont = {}




// Post Review in Database and refresh page
reviewCont.postReview = async function (req, res, next) {
    const {review_text, inv_id, account_id} = req.body
  
    //Insert review in Database
    const reviewResult = await reviewModel.insertReview(review_text, inv_id, account_id)
    if (reviewResult) {
      req.flash("notice", "Your review has been posted on the page! Thanks for your feedback!")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Unfortunately we could not proccess your review. Try again later")
      res.redirect(`/inv/detail/${inv_id}`)
    }
  }


  
// Edits Review
reviewCont.editReview = async function (req, res){
    const {review_id, review_text} = req.body
    let reviewResult = await reviewModel.editReview(review_id, review_text)
    if (reviewResult){
        req.flash("notice","Congratulations, your review has been edited!")
        res.redirect("/account/")
    } else {
        req.flash("notice","Unfortunately there was an error and we couldn't update the review")
        let reviews = await utilities.getReviewsByAccount(account_id)
        let nav = await utilities.getNav()
        res.status(501).render(`/account/`, {
            nav,
            title: "Account Management",
            reviews,
            errors: null,            
        })
    }
}

// Delete review
  reviewCont.deleteReview = async function (req, res){
    const {review_id} = req.body
    let reviewResult = await reviewModel.deleteReviewbyId(review_id)
    if (reviewResult){
        req.flash("notice", "Review has been sucessfully deleted!")
        res.redirect("/account/")
    } else {
        let account_id = res.locals.accountData.account_id
        let nav = await utilities.getNav()
        let reviews = await utilities.getReviewsByAccount(account_id)
        req.flash("notice", "Unfortunately there was an error and the review could not be deleted.")
        res.status(501).render("account/management",{
            title: "Account Management",
            nav,
            errors: null,
            reviews,
        })
    }
}


  module.exports = reviewCont