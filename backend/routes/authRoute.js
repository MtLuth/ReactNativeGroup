import express from "express";
import authController from "../controller/authController.js";

export const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/resend-otp", authController.resendOtp);
