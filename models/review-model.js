const pool = require("../database/")




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


  
// Insert review into review table
async function insertReview(review_text, inv_id, account_id){
    try {
      const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
      return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
      return error.message
    }
  }

// Queries review from an existing inv_id
async function getReviewsById(inv_id){
    try {
      const sql = "SELECT account_firstname, account_lastname, review_text, review_date FROM review JOIN account ON review.account_id = account.account_id WHERE review.inv_id = $1 ORDER BY review_date DESC"
      return await pool.query(sql, [inv_id])
    } catch (error) {
      return error.message
    }
  }
  
  
  
  // Queries review from an existing account_id
  async function getReviewsByAccountId(account_id){
    try {
      const sql = "SELECT account_id, review_id, review_date, inv_year, inv_make, inv_model FROM review JOIN inventory ON review.inv_id = inventory.inv_id WHERE review.account_id = $1 ORDER BY review_date DESC"
      return await pool.query(sql, [account_id])
    } catch (error) {
      return error.message
    }
  }


  module.exports = {getReviewById, editReview, deleteReviewbyId, getReviewAuthor, insertReview, getReviewsById, getReviewsByAccountId}