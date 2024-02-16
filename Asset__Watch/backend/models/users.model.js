// In models/users.model.js

import { db } from "../config/db.js";

export const register = async (email, password) => {
  try {
    // Start a transaction to ensure both user creation and watchlist population are successful
    const result = await db.transaction(async (trx) => {
      // Inserting the user with default name and surname, and returning the new user's id and email
      const user = await trx("users").insert(
        {
          email: email,
          password: password, // Ensure this password is hashed for security
          name: "please update", // Default name
          surname: "your profile", // Default surname
        },
        ["id", "email"]
      );

      const userId = user[0].id; // Assuming the first element contains the user data

      // Define a default set of stock symbols for the watchlist
      const defaultWatchlistSymbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"];

      // Prepare watchlist entries for the new user
      const watchlistEntries = defaultWatchlistSymbols.map((symbol) => ({
        user_id: userId,
        symbol: symbol,
      }));

      // Insert default watchlist entries for the new user
      await trx("watchlist").insert(watchlistEntries);

      return user; // Return the new user's data
    });

    return result; // Return the result of the transaction
  } catch (error) {
    throw error; // Propagate errors
  }
};

export const login = (email) => {
  return db("users").select("id", "email", "password").where({ email });
};

export const all = () => {
  return db("users").select("id", "email").orderBy("id"); // "password"
};

export const updateUserProfile = async (userId, profileData) => {
  // Filter out undefined, empty string fields and the userId field from profileData
  const updateData = Object.keys(profileData).reduce((acc, key) => {
    if (profileData[key] !== undefined && profileData[key] !== "" && key !== "userId") {
      acc[key] = profileData[key];
    }
    return acc;
  }, {});

  try {
    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    const updatedUser = await db("users")
      .where({ id: userId }) // Using 'id' as the column name to match your users table
      .update(updateData, [
        "email",
        "name",
        "surname",
        "age",
        "gender",
        "facebook",
        "instagram",
        "linkedin",
      ]);

    console.log("Update result:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("updateProfile=>", error.message);
    throw error;
  }
};

export const isUserProfileComplete = async (userId) => {
  const user = await db("users").select("name", "surname").where({ id: userId }).first();
  // Check if mandatory fields are filled
  return user && user.name && user.surname;
};

export const getUserProfile = async (userId) => {
  return db("users").where({ id: userId }).first();
};
