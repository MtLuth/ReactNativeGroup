import express from "express";
import multer from "multer";
import mediaController from "../controller/mediaController.js";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

export const mediaRouter = express.Router();

mediaRouter.route("/upload").post(upload, mediaController.uploadImage);
