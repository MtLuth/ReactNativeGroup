import User from "../model/user.js";

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phoneNumber);
};

class UserService {
  async updateOneSignalPlayerId(userId, playerId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại!");
    }

    user.oneSignalPlayerId = playerId;
    await user.save();

    return {
      success: true,
      message: "Cập nhật OneSignal Player ID thành công!",
    };
  }

  async editProfile(fullName, email, phoneNumber, id, avatar) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại!");
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        throw new Error("Email đã tồn tại!");
      }
    }

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingPhone = await User.findOne({ phoneNumber });
      if (existingPhone) {
        throw new Error("Số điện thoại đã tồn tại!");
      }
    }

    if (email && !validateEmail(email)) {
      throw new Error("Email không hợp lệ!");
    }

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      throw new Error("Số điện thoại phải có 10 chữ số!");
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.avatar = avatar || user.avatar;
    await user.save();

    return { success: true, message: "Cập nhật thông tin thành công!", user };
  }

  async getProfile(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    const { _id, email, fullName, avatar, phoneNumber } = user;
    return { _id, email, fullName, avatar, phoneNumber };
  }
}

export default new UserService();
