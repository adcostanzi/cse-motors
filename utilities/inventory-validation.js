const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}


// Add Classification Form Validation Rules
validate.classificationRules = () => {
    return [
        // name must be alphabetic only
        body("classification_name")
            .trim()
            .isAlpha()
            .withMessage("Please provide a valid classification. Numbers and special characters not allowed."),
    ]
}

// Check classification form: return errors or continues with process
validate.checkClassification = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}


// Validation rules for review_text (textarea)
validate.reviewRules = () => {
    return [
        body("review_text")
            .trim()
            .isLength({min: 30})
            .withMessage("Review should be at least 30 characters long")
    ]
}

// Check reviews form: return errors or continue
validate.checkReview = async (req, res, next) => {
    const {inv_id, review_text} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        let car = await utilities.getCarName(inv_id)
        res.render("inventory/detail", {
            title : `${car}`,
            nav,
            errors,
            review_text: review_text,
            toRender: inv_id,
        })
        //return
    }
    next()
}

// Add Inventory Form Validation Rules
validate.inventoryRules = () => {
    return [
        
        body("classification_id")
            .trim()
            .isNumeric()
            .withMessage("Please provide a valid classification."),

            body("inv_make")
            .trim()
            .isLength({min: 3})
            .withMessage("Please provide a valid Make"),

            body("inv_model")
            .trim()
            .isLength({min: 3})
            .withMessage("Please provide a valid Model"),

            body("inv_year")
            .trim()
            .isLength(4).withMessage("Year must be a 4 digit number")
            .isInt()
            .withMessage("Please provide a valid Year"),

            body("inv_description")
            .trim()
            .isLength({min: 30})
            .withMessage("Description has to be at least 30 characters."),

            body("inv_image")
            .trim()
            .isLength({min:1})
            .withMessage("Please provide a valid image path"),

            body("inv_thumbnail")
            .trim()
            .isLength({min:1})
            .withMessage("Please provide a valid thumbnail path"),

            body("inv_price")
            .trim()
            .isNumeric()
            .withMessage("Price must be a number"),

            body("inv_miles")
            .trim()
            .isInt()
            .withMessage("Please provide a valid milage"),

            body("inv_color")
            .trim()
            .isAlpha()
            .withMessage("Please provide a valid color"),
    ]
}




// Check inventory form: return errors or continues with process
validate.checkInventory = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        let select = await utilities.getClassificationSelect(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            select,
            title: "Add Vehicle",
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

// Check update inventory form: return errors if any to edit view
validate.checkUpdateData = async (req, res, next) => {
    const {classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        let select = await utilities.getClassificationSelect(classification_id)
        res.render("inventory/edit-inventory", {
            errors,
            select,
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

module.exports = validate