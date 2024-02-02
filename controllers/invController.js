const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildDetailsByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getDetailsByInvId(inv_id)
  const details = await utilities.buildDetailsPage(data)
  let nav = await utilities.getNav()
  const carName = `${data.inv_make} ${data.inv_model}` 
  res.render("./inventory/detail", {
    title: carName,
    nav,
    details
  })
}


invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

invCont.buildManagementClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}


invCont.addClassification = async function (req, res){
  const {classification_name} = req.body

  //Send request to Model
  const invResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()
  if (invResult){
    req.flash("notice", `Congratulations! Classification ${classification_name} has been added`)
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Sorry, there classification was not added")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors:null,
    })
  }
} 

module.exports = invCont