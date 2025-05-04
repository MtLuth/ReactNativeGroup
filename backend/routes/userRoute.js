import express from "express";
import userController from "../controller/userController.js";
import verifyUser from "../middleware/verifyUser.js";
import orderController from "../controller/orderController.js";

export const userRouter = express.Router();

userRouter.route("/").get(verifyUser, userController.getUserInformation);
userRouter.route("/:id").put(userController.editProfile);
router.put("/onesignal", verifyUser, userController.updatePlayerId);
