const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}

// Classification Form Validation Rules
validate.classificationRules = () => {
    return [
        // name must be alphabetic only
        body("classification_name")
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

module.exports = validate