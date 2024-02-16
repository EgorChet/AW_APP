import express from "express";
import {
  _register,
  _all,
  _login,
  _logout,
  _refreshToken,
  updateProfile,
  fetchUserProfile,
  updateAvatar,
} from "../controllers/usersController.js";
import { verifytoken } from "../middlewares/verifyToken.js";

const usersRouter = express.Router();

usersRouter.get("/", verifytoken, _all);
usersRouter.post("/refresh", _refreshToken);
usersRouter.get("/verify", verifytoken, (req, res) => {
  res.sendStatus(200);
});

usersRouter.post("/register", _register);
usersRouter.post("/login", _login);
usersRouter.post("/logout", _logout);

usersRouter.post("/updateProfile", verifytoken, updateProfile);
usersRouter.get("/profile/:userId", verifytoken, fetchUserProfile);
usersRouter.post("/updateAvatar/:userId", verifytoken, updateAvatar);

export default usersRouter;
