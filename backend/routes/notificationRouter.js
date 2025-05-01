import express from "express";
import notificationService from "../service/notificationService.js";

const router = express.Router();

router.get("/:userId", async (req, res, next) => {
  try {
    const data = await notificationService.getByUser(req.params.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const data = await notificationService.markAsRead(
      req.params.id,
      req.body.userId
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export { router as notificationRouter };
