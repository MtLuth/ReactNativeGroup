import express from "express";
import userController from "../controller/userController.js";

export const userRouter = express.Router();

userRouter.route("/:id").get(userController.getUserInformation);
userRouter.route("/:id").put(userController.editProfile);
