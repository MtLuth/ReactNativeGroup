import Notification from "../model/notification.js";
import axios from "axios";
class NotificationService {
  async create(userId, message, type) {
    const noti = await Notification.create({ user: userId, message, type });

    if (global.io) {
      global.io.to(userId.toString()).emit("notification:new", {
        _id: noti._id,
        message,
        type,
        createdAt: noti.createdAt,
      });
    } else {
      console.warn(
        "⚠️ global.io is undefined – không thể gửi socket notification"
      );
    }
    await sendPushNotification(userId, message);
    return noti;
  }

  async getByUser(userId) {
    try {
      return await Notification.find({ user: userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thông báo:", error);
      throw error;
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      return await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead: true },
        { new: true }
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
      throw error;
    }
  }
  async sendPushNotification(userId, message) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.oneSignalPlayerId) {
        console.warn("Không tìm thấy OneSignal Player ID của người dùng");
        return;
      }

      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID,
          include_player_ids: [user.oneSignalPlayerId],
          contents: { en: message },
          headings: { en: "Thông báo từ cửa hàng" },
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Lỗi gửi push notification:", error.message);
    }
  }
}

export default new NotificationService();
