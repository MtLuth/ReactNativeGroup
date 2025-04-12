import authService from "../service/authService.js";
import catchAsync from "../utils/catchAsync.js";

class AuthController {
  register = catchAsync(async (req, res, next) => {
    const { email, password, confirmPassword, fullName } = req.body;
    const savedUser = await authService.register(
      email,
      password,
      confirmPassword,
      fullName
    );
    res.status(201).json({
      status: "success",
      data: savedUser,
    });
  });

  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const loginResponse = await authService.login(email, password);

    res.status(200).json({
      status: "success",
      message: loginResponse.message,
      token: loginResponse.token,
    });
  });
  resendOtp = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const response = await authService.resendOtp(email);

    res.status(200).json({
      status: "success",
      message: response.message,
    });
  });

  sendOTPVerifyEmail = catchAsync(async (req, res, next) => {
    const { id, email } = req.body;

    const response = await authService.sendOTPVerifyEmail(id, email);

    res.status(200).json({
      status: "success",
      message: response.message,
    });
  });

  verifyOtp = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    const verificationResponse = await authService.verifyOtp(email, otp);

    res.status(200).json({
      status: "success",
      message: verificationResponse.message,
    });
  });

  verifyOtpWithId = catchAsync(async (req, res, next) => {
    const { id, otp } = req.body;

    const verificationResponse = await authService.verifyOTPWithId(id, otp);

    res.status(200).json({
      status: "success",
      message: verificationResponse.message,
    });
  });

  resetPassword = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const response = await authService.resetPassword(email, password);

    res.status(200).json(response);
  });
}

export default new AuthController();
