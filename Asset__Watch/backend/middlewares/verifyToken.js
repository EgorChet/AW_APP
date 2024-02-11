import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifytoken = (req, res, next) => {
  // Try to get the token from the Authorization header
  let token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

  // If the token was not found in the Authorization header, try getting it from cookies
  token = token || req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.status(403).json({ error: err.message, msg: "Forbidden" });
    }
    console.log("Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  });
};
