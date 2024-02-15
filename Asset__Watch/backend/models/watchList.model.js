import { db } from "../config/db.js";

export const addToWatchlist = async (userId, symbol) => {
  try {
    // First, check if the symbol already exists for the user
    const existingRecord = await db("watchlist")
      .where({
        user_id: userId,
        symbol: symbol,
      })
      .first(); // Using .first() since we're only interested in the first match, if any

    // If the record already exists, return a message or handle as needed
    if (existingRecord) {
      return { status: "duplicate", message: "Stock is already in the watchlist" };
    }

    // If it doesn't exist, insert the new record
    const result = await db("watchlist")
      .insert({
        user_id: userId,
        symbol: symbol,
      })
      .returning("*"); // This will return the inserted record

    // Since returning('*') gives an array, we take the first element
    return { status: "success", data: result[0] };
  } catch (error) {
    throw error;
  }
};

// export const addToWatchlist = async (userId, symbol) => {
//   try {
//     // Using Knex's insert method and returning the inserted record
//     const result = await db("watchlist")
//       .insert({
//         user_id: userId,
//         symbol: symbol,
//       })
//       .returning("*"); // This will return the inserted record

//     return result[0]; // Since returning('*') gives an array, we take the first element
//   } catch (error) {
//     throw error;
//   }
// };

export const getWatchlist = async (userId) => {
  try {
    // Selecting all records from 'watchlist' where 'user_id' matches
    const result = await db("watchlist")
      .where({
        user_id: userId,
      })
      .select("*");

    return result; // This already returns an array of matching records
  } catch (error) {
    throw error;
  }
};

export const removeFromWatchlist = async (userId, symbol) => {
  try {
    // Deleting a record from 'watchlist' where both 'user_id' and 'symbol' match
    const result = await db("watchlist")
      .where({
        user_id: userId,
        symbol: symbol,
      })
      .del()
      .returning("*"); // Returning the deleted record

    return result[0]; // Assuming the operation deletes one row, return it
  } catch (error) {
    throw error;
  }
};
