// In models/users.model.js

import { db } from "../config/db.js";

export const register = (email, password) => {
  return db("users").insert({ email, password }, ["id", "email"]); // "password"
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
  return db('users').where({ id: userId }).first();
};
