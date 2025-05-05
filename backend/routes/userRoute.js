import express from "express";
import userController from "../controller/userController.js";
import verifyUser from "../middleware/verifyUser.js";
import orderController from "../controller/orderController.js";

export const userRouter = express.Router();

userRouter.route("/").get(verifyUser, userController.getUserInformation);
userRouter.route("/:id").put(userController.editProfile);
userRouter.put("/onesignal", verifyUser, userController.updatePlayerId);
userRouter.get("/all", verifyUser, userController.getAllUsers);

userRouter.put("/:id/role", verifyUser, userController.updateUserRole);
