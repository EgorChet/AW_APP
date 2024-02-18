import {
  register,
  login,
  all,
  updateUserProfile,
  isUserProfileComplete,
  getUserProfile,
  updateAvatarUrl,
} from "../models/users.model.js";
import { getUserStocks } from "../models/stocks.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const fetchUserProfile = async (req, res) => {
  const { userId } = req.params || req.user.id; // Or req.user.id if you're extracting from JWT payload

  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

export const _login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await login(email.toLowerCase());
    if (users.length === 0) {
      return res.status(404).json({ msg: "Email not found" });
    }

    const user = users[0];
    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      // Adjusted payload keys for consistency (e.g., use 'id' instead of 'userid')
      const accessToken = jwt.sign(
        { id: user.id, email: user.email }, // Consistent payload keys
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "3h" }
      );

      // Check if the user's profile is complete and if they have a portfolio
      const isComplete = await isUserProfileComplete(user.id);
      const hasPortfolio = await getUserStocks(user.id).then((stocks) => stocks.length > 0);

      // Include isProfileComplete and hasPortfolio flags along with accessToken in the login response
      res.json({
        accessToken,
        isProfileComplete: isComplete,
        hasPortfolio: hasPortfolio,
        user: { id: user.id, email: user.email }, // Include user ID and email in the response
      });
    } else {
      return res.status(401).json({ msg: "Wrong password" });
    }
  } catch (error) {
    console.error("_login=>", error);
    res.status(500).json({ msg: "Something went wrong during login" });
  }
};

export const _register = async (req, res) => {
  const { email, password } = req.body;
  const loweremail = email.toLowerCase();
  const salt = bcrypt.genSaltSync(10);
  const hashpass = bcrypt.hashSync(password + "", salt); // Ensure password is a string

  try {
    const row = await register(loweremail, hashpass);
    // It's better to set the status before sending the response.
    // Also, ensure not to call res.json() multiple times.
    res.status(201).json({ message: "User registered successfully", user: row });
  } catch (error) {
    console.log("register error=>", error);

    // Check the specific error code or type depending on your database and ORM/Query builder
    // For example, if using PostgreSQL with Knex, a unique violation has the code '23505'
    // Adjust the condition based on the error structure and database you are using
    if (error.code === "23505" || error.message.includes("unique constraint")) {
      res.status(409).json({ message: "Email already exists." });
    } else {
      // Handle other errors more generically
      res.status(500).json({ message: "An error occurred during registration." });
    }
  }
};

export const _all = async (req, res) => {
  try {
    const rows = await all();
    res.json(rows);
  } catch (error) {
    console.log("_all=>", error);
    res.status(404).json({ msg: "Not Found" });
  }
};

export const _logout = (req, res) => {
  res.clearCookie("refreshToken", { path: "/users/refresh" }); // Match the path you set for your cookie
  res.status(200).json({ msg: "Logged out" });
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const profileData = req.body;

  try {
    const updatedUser = await updateUserProfile(userId, profileData);
    res.json(updatedUser);
  } catch (error) {
    console.error("updateProfile=>", error);
    res.status(500).json({ msg: "Error updating profile" });
  }
};

// Controller function to handle avatar URL updates
export const updateAvatar = async (req, res) => {
  const { userId } = req.params; // Assuming you're passing userId in the URL
  const { avatarUrl } = req.body; // The new avatar URL should be part of the request body

  // Basic validation (You can expand this according to your needs)
  if (!userId || !avatarUrl) {
    return res.status(400).json({ message: "Missing userId or avatarUrl in request." });
  }

  try {
    // Call the model function with the userId and avatarUrl
    const updatedUser = await updateAvatarUrl(userId, avatarUrl);

    if (updatedUser) {
      // If the user was updated successfully, return the updated user data
      return res.status(200).json({
        message: "Avatar updated successfully.",
        user: updatedUser,
      });
    } else {
      // If the user was not found or not updated for some reason
      return res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// export const _refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.cookies;
//     if (!refreshToken) return res.status(401).json({ msg: "Unauthorized" });

//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
//       if (err) return res.status(403).json({ msg: "Forbidden" });

//       // Issue a new access token
//       const accessToken = jwt.sign(
//         { userid: decoded.userid, useremail: decoded.useremail },
//         process.env.JWT_ACCESS_SECRET,
//         { expiresIn: "15m" }
//       );

//       res.json({ accessToken });
//     });
//   } catch (error) {
//     console.log("_refreshToken=>", error);
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// };