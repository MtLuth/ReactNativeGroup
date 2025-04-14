import User from "../model/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendOTP } from "../utils/sendOTP.js";
import jwt from "jsonwebtoken";

class authService {
  async register(email, password, confirmPassword, fullName) {
    if (password !== confirmPassword) {
      throw new Error("Mật khẩu xác nhận không khớp!");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email đã tồn tại!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await sendOTP(email, otp);

    return newUser;
  }

  async verifyOtp(email, otp) {
    const user = await User.findOne({ email });

    console.log(user);
    if (!user) {
      throw new Error("Người dùng không tồn tại!");
    }

    if (user.otp !== otp || new Date() > user.otpExpires) {
      throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn!");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return {
      success: true,
      message: "Xác thực OTP thành công! Tài khoản đã được kích hoạt.",
    };
  }

  async verifyOTPWithId(id, otp) {
    const user = await User.findById(id);

    console.log(user);
    if (!user) {
      throw new Error("Người dùng không tồn tại!");
    }

    if (user.otp !== otp || new Date() > user.otpExpires) {
      throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn!");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return {
      success: true,
      message: "Xác thực OTP thành công! Tài khoản đã được kích hoạt.",
    };
  }

  async resendOtp(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Người dùng không tồn tại!");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTP(email, otp);

    return {
      success: true,
      message: "Mã OTP mới đã được gửi vào email của bạn!",
    };
  }

  async sendOTPVerifyEmail(id, email) {
    const user = await User.findById(id);

    if (!user) {
      throw new Error("Người dùng không tồn tại!");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTP(email, otp);

    return {
      success: true,
      message: "Mã OTP mới đã được gửi vào email của bạn!",
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }

    if (!user.isVerified) {
      throw new Error("Tài khoản chưa được xác thực!");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role | "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return { success: true, message: "Đăng nhập thành công!", token };
  }

  async editProfile(fullName, email) {
    const user = await User.findById(email);
    if (!user) {
      throw new Error("Người dùng không tồn tại!");
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    await user.save();

    return { success: true, message: "Cập nhật thông tin thành công!", user };
  }

  async getProfile(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    const { _id, email, fullName, avatar } = user;
    return { _id, email, fullName, avatar };
  }

  async resetPassword(email, newPassword) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Người dùng không tồn tại!");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { success: true, message: "Đặt lại mật khẩu thành công!" };
  }
}

export default new authService();
