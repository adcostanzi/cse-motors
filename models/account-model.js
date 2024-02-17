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

// Queries review from an existing review_id
async function getReviewById(review_id){
    try {
      const sql = "SELECT review_text, review_date, inv_year, inv_make, inv_model FROM review JOIN inventory ON review.inv_id = inventory.inv_id WHERE review_id = $1"
      let res = await pool.query(sql, [review_id])
      return res.rows[0]
    } catch (error) {
      return error.message
    }
  }

// Updates review text
async function editReview(review_id, review_text){
    try {
      const sql = "UPDATE review  SET review_text = $1 WHERE review_id = $2 RETURNING *"
      return await pool.query(sql, [review_text, review_id])
    } catch (error) {
      return error.message
    }
  }


  
  // Deletes review
  async function deleteReviewbyId(review_id){
      try {
        const sql = "DELETE FROM review WHERE review_id = $1"
        return await pool.query(sql, [review_id])
      } catch (error) {
        new Error("Delete Inventory Error")
      }
    }
    

  
  // Get review author
  async function getReviewAuthor(review_id){
    try {
      const sql = "SELECT account_id FROM review WHERE review_id = $1"
      let res = await pool.query(sql, [review_id])
      return res.rows[0]
    } catch (error) {
      return error.message
    }
  }

module.exports = {registerAccount, checkExistingEmail, checkCredentials, getAccountByEmail, getAccountById, updateInformation, updatePassword, getReviewById, editReview, deleteReviewbyId, getReviewAuthor}