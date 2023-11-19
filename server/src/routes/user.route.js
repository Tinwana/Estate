import express from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRoute = express.Router();

userRoute.delete("/:userId", authMiddleware, userController.deleteUser);
userRoute.patch("/:userId", authMiddleware, userController.updateUser);

export default userRoute;
