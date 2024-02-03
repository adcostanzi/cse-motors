// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build view by inventory id
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailsByInvId))

// Route to build management classification
router.get("/add-classification",utilities.handleErrors(invController.buildManagementClassification))

// Route to build management classification
router.get("/add-inventory",utilities.handleErrors(invController.buildManagementInventory))

//Route when Adding classification
router.post("/add-classification",
invValidate.classificationRules(),
invValidate.checkClassification,
utilities.handleErrors(invController.addClassification))

//Route when Adding classification
router.post("/add-inventory",
invValidate.inventoryRules(),
invValidate.checkInventory,
utilities.handleErrors(invController.addInventory))


module.exports = router;