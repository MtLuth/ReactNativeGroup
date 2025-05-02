import Notification from "../model/notification.js";

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
      console.warn("⚠️ global.io is undefined – không thể gửi socket notification");
    }

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
}

export default new NotificationService();
