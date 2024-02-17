const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getClassificationName(classification_id){
  try {
    const classification_name = await pool.query("SELECT classification_name FROM classification WHERE classification_id = $1", [classification_id])
    return classification_name.rows[0].classification_name
  } catch (error) {
    return error.message
  }
}


// Get Details by Inventory ID
async function getDetailsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getdetailsbyinvid error" + error)
  }
}

// Adds classification into Database
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

// Adds new inventory to Database
async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

// Updates existing inventory
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id ){
  try {
    const sql = "UPDATE inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])
  } catch (error) {
    return error.message
  }
}

// Deletes existing inventory (vehicle)
async function deleteInventory(inv_id){
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    return await pool.query(sql, [inv_id])
  } catch (error) {
    new Error("Delete Inventory Error")
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


// Insert review into review table
async function insertReview(review_text, inv_id, account_id){
  try {
    const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByInvId, addClassification, addInventory, getClassificationName, updateInventory, deleteInventory, getReviewsById, insertReview, getReviewsByAccountId}