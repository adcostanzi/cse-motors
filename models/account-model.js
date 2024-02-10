const pool = require("../database/")
const bcrypt = require("bcryptjs")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])   
    } catch (error) {
        return error.message
    }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }


async function checkCredentials(account_email, account_password){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1 "
        const account = await pool.query(sql, [account_email])
        const isPasswordValid = await bcrypt.compare(account_password, account.rows[0].account_password)
        return isPasswordValid
    } catch (error) {
        return error.message
    }
}

// Return account data using email address
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1", [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

// Return account data using account id
async function getAccountById(account_id) {
    try {
        const result = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1", [account_id])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching id found")
    }
}

// Updates information in Database based on account_id
async function updateInformation(account_id, account_firstname, account_lastname, account_email){
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    } catch (error) {
        return error.message
    }
}

// Updates password in Database based on account_id
async function updatePassword(account_id, account_password){
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        return await pool.query(sql, [account_password, account_id])
    } catch (error) {
        return error.message
    }
}


module.exports = {registerAccount, checkExistingEmail, checkCredentials, getAccountByEmail, getAccountById, updateInformation, updatePassword}