/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require("./database/")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}))

// Express Messages Middleware
app.use(require("connect-flash")())
app.use(function(req, res, next){
  res.locals.messages = require("express-messages")(req, res)
  next()
})

app.use(bodyParser.json()) // tells the express application to use the body parser to work with JSON data (to be used later).
app.use(bodyParser.urlencoded({extended:true})) //Tells the express application to read and work with data sent via a URL as well as from a form, stored in the request object's body. The "extended: true" object is a configuration that allows rich objects and arrays to be parsed. The final part is an inline comment pertaining to the entire line.

app.use(cookieParser())

app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

//Index route
app.get("/", utilities.checkJWTToken, utilities.handleErrors(baseController.buildHome))

app.get("/test", utilities.handleErrors(baseController.createError))

//Index route
app.get("/logout", utilities.clearJWTToken, utilities.handleErrors(baseController.buildHome))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: '<img class="error-img" src="/images/site/404-error-page.webp" alt="404 Error picture">'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404){ message = err.message} else { err.message = `<img class="error-img" src="/images/site/500-error.jpg" alt="500 Error picture">`}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
