import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mã xác thực OTP",
    text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP đã được gửi đến email: ", email);
  } catch (error) {
    console.error("Lỗi khi gửi OTP: ", error);
    throw new Error("Không thể gửi OTP, vui lòng thử lại sau.");
  }
};

export const generateOtpAndSendEmail = async (email) => {
  const otp = generateOtp();
  await sendOTP(email, otp);
  this.otpStore = this.otpStore || {};
  this.otpStore[email] = otp;
  console.log(`OTP cho email ${email}: ${otp}`);
};

export const verifyOtp = (email, otp) => {
  if (this.otpStore[email] === otp) {
    return true;
  }
  return false;
};
