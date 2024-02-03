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
  let className = await invModel.getClassificationName(classification_id)
  res.render("./inventory/classification", {
    title: `${className} vehicles`,
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

// Builds view for Management Menu
invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

// Builds view for Management Classification
invCont.buildManagementClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

// Builds view for Management of Inventory
invCont.buildManagementInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let select = await utilities.getClassificationSelect()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    errors: null,
    select,
  })
}

// Adds Classification to Database and Nav or returns error
invCont.addClassification = async function (req, res){
  const {classification_name} = req.body

  //Send request to Model
  const classificationResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()
  if (classificationResult){
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

// Adds Invneotry to Database or returns error
invCont.addInventory = async function (req, res) {
  const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body

  // Send request to INSERT in Database
  const inventoryResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
  let nav = await utilities.getNav()
  if(inventoryResult){
    req.flash("notice", `Congratulations! ${inv_year} ${inv_make} ${inv_model} has been added to Inventory.`)
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Unfortunately the vehicle could not be added to inventory")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors: null,
    })
    }
}




module.exports = invCont